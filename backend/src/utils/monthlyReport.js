// Monthly infrastructure performance reports.
// Everything is computed from complaint history (status updates are timestamped), so a report
// for a past month reflects what the status of each complaint was at the end of that month.
// Month boundaries use UTC.

const DAY = 86400000;
const OVERDUE_DAYS = 7;     // service target used across CivicBridge
const ESCALATION_DAYS = 14;
const CLOSED = ["Resolved", "Rejected"];

const monthKey = (date) => date.toISOString().slice(0, 7);

function monthRange(month) {
  const [year, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, m - 1, 1));
  const end = new Date(Date.UTC(year, m, 1)); // exclusive
  return { start, end };
}

function monthLabel(month) {
  const { start } = monthRange(month);
  return start.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

function previousMonth(month) {
  const { start } = monthRange(month);
  return monthKey(new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 1, 1)));
}

function isValidMonth(value) {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

// Sorted status history including the initial "Submitted" state.
function history(c) {
  const events = (c.updates || [])
    .map((u) => ({ status: u.status, at: new Date(u.updatedAt) }))
    .filter((u) => !Number.isNaN(u.at.getTime()))
    .sort((a, b) => a.at - b.at);
  return events.length ? events : [{ status: "Submitted", at: new Date(c.createdAt) }];
}

function statusAt(c, moment) {
  if (new Date(c.createdAt) >= moment) return null; // did not exist yet
  let status = "Submitted";
  for (const e of history(c)) {
    if (e.at < moment) status = e.status;
  }
  return status;
}

// Transitions between statuses inside [start, end).
function transitions(c, start, end) {
  const out = [];
  let previous = "Submitted";
  for (const e of history(c)) {
    if (e.status !== previous) {
      if (e.at >= start && e.at < end) out.push({ from: previous, to: e.status, at: e.at });
    }
    previous = e.status;
  }
  return out;
}

const round1 = (n) => Math.round(n * 10) / 10;
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null);

function metrics(complaints, start, end, asOf) {
  let received = 0, resolved = 0, rejected = 0, reopened = 0;
  let backlogIn = 0, openAtEnd = 0, overdueAtEnd = 0, escalatedAtEnd = 0;
  let supports = 0, onTime = 0;
  const resolutionDays = [];
  const ratings = [];
  let verified = 0;

  for (const c of complaints) {
    const created = new Date(c.createdAt);
    if (created >= start && created < end) {
      received += 1;
      supports += (c.supporters || []).length;
    }

    const startStatus = statusAt(c, start);
    if (startStatus && !CLOSED.includes(startStatus)) backlogIn += 1;

    const t = transitions(c, start, end);
    const resolvedEvents = t.filter((x) => x.to === "Resolved");
    if (resolvedEvents.length) {
      const last = resolvedEvents[resolvedEvents.length - 1];
      resolved += 1;
      const days = (last.at - created) / DAY;
      resolutionDays.push(days);
      if (days <= OVERDUE_DAYS) onTime += 1;
      if (c.verified) verified += 1;
      if (Number.isInteger(c.repairRating)) ratings.push(c.repairRating);
    }
    rejected += t.filter((x) => x.to === "Rejected").length;
    reopened += t.filter((x) => x.from === "Resolved" && x.to !== "Resolved").length;

    const endStatus = statusAt(c, end);
    if (endStatus && !CLOSED.includes(endStatus)) {
      openAtEnd += 1;
      const ageDays = (asOf - created) / DAY;
      if (ageDays >= OVERDUE_DAYS) overdueAtEnd += 1;
      if (ageDays >= ESCALATION_DAYS) escalatedAtEnd += 1;
    }
  }

  const handled = backlogIn + received;
  const avgDays = resolutionDays.length
    ? round1(resolutionDays.reduce((a, b) => a + b, 0) / resolutionDays.length)
    : null;

  return {
    received,
    resolved,
    rejected,
    reopened,
    backlogIn,
    openAtEnd,
    overdueAtEnd,
    escalatedAtEnd,
    resolutionRate: pct(resolved, handled),     // resolved ÷ (open at start + received)
    onTimeRate: pct(onTime, resolved),           // resolved within the 7-day target
    avgResolutionDays: avgDays,
    communitySupports: supports,
    verifiedRepairs: verified,
    avgRepairRating: ratings.length ? round1(ratings.reduce((a, b) => a + b, 0) / ratings.length) : null,
    handled,
  };
}

// Rule-based, deliberately simple, and documented in the README.
function rate(m) {
  if (m.handled === 0) return "No activity";
  if (m.escalatedAtEnd > 0 || (m.resolutionRate ?? 0) < 40) return "Needs attention";
  if ((m.resolutionRate ?? 0) >= 70) return "Good";
  return "Fair";
}

function highlights(scopeName, city, departments, categories, previous) {
  const lines = [];
  if (city.handled === 0) return ["No reports were open or received in this period."];

  lines.push(
    `${city.received} new report${city.received === 1 ? " was" : "s were"} received and ${city.resolved} resolved` +
      (city.resolutionRate !== null ? `, a ${city.resolutionRate}% resolution rate.` : ".")
  );

  if (previous && previous.received > 0 && city.received !== previous.received) {
    const change = Math.round(((city.received - previous.received) / previous.received) * 100);
    lines.push(`Report volume ${change > 0 ? "rose" : "fell"} ${Math.abs(change)}% compared with the previous month.`);
  }

  if (city.avgResolutionDays !== null) {
    lines.push(
      `Resolved reports took ${city.avgResolutionDays} day${city.avgResolutionDays === 1 ? "" : "s"} on average; ` +
        `${city.onTimeRate}% met the ${OVERDUE_DAYS}-day target.`
    );
  }

  const topCategory = [...categories].sort((a, b) => b.received - a.received)[0];
  if (topCategory && topCategory.received > 0) {
    lines.push(`${topCategory.category} was the most reported issue (${topCategory.received}).`);
  }

  if (departments.length > 1) {
    const active = departments.filter((d) => d.handled > 0);
    const attention = active.filter((d) => d.rating === "Needs attention").map((d) => d.department);
    if (attention.length) lines.push(`Needs attention: ${attention.join(", ")}.`);
  }

  if (city.overdueAtEnd > 0) {
    lines.push(
      `${city.overdueAtEnd} open report${city.overdueAtEnd === 1 ? " is" : "s are"} past the ${OVERDUE_DAYS}-day target` +
        (city.escalatedAtEnd ? `, ${city.escalatedAtEnd} beyond ${ESCALATION_DAYS} days (escalation due).` : ".")
    );
  }

  if (city.avgRepairRating !== null) {
    lines.push(`Citizens rated verified repairs ${city.avgRepairRating}/5 on average.`);
  }

  return lines;
}

// One report, optionally limited to a single department.
function buildReport(allComplaints, month, department, now) {
  const { start, end } = monthRange(month);
  const asOf = now < end ? now : end;
  const scoped = department ? allComplaints.filter((c) => c.department === department) : allComplaints;

  const summary = metrics(scoped, start, end, asOf);
  const prevMonth = previousMonth(month);
  const prevRange = monthRange(prevMonth);
  const previous = metrics(scoped, prevRange.start, prevRange.end, prevRange.end);

  const departmentNames = department
    ? [department]
    : Array.from(new Set(allComplaints.map((c) => c.department))).sort();
  const departments = departmentNames.map((name) => {
    const m = metrics(scoped.filter((c) => c.department === name), start, end, asOf);
    return { department: name, ...m, rating: rate(m) };
  });

  const categoryNames = Array.from(new Set(scoped.map((c) => c.category))).sort();
  const categories = categoryNames.map((name) => {
    const m = metrics(scoped.filter((c) => c.category === name), start, end, asOf);
    return { category: name, received: m.received, resolved: m.resolved, openAtEnd: m.openAtEnd, avgResolutionDays: m.avgResolutionDays };
  });

  const hasPrevious = previous.handled > 0;

  return {
    month,
    label: monthLabel(month),
    scope: department || "All departments",
    periodStart: start.toISOString(),
    periodEnd: new Date(end - 1).toISOString(),
    asOf: asOf.toISOString(),
    summary: { ...summary, rating: rate(summary) },
    previous: hasPrevious ? previous : null,
    departments,
    categories,
    highlights: highlights(department || "All departments", summary, departments, categories, hasPrevious ? previous : null),
    targets: { overdueDays: OVERDUE_DAYS, escalationDays: ESCALATION_DAYS },
  };
}

// The full set of reports for a month: city-wide plus one per department.
function buildBundle(complaints, month, { now = new Date(), generatedBy = "system" } = {}) {
  const { end } = monthRange(month);
  const departments = Array.from(new Set(complaints.map((c) => c.department)));
  const reports = { ALL: buildReport(complaints, month, null, now) };
  for (const d of departments) reports[d] = buildReport(complaints, month, d, now);

  return {
    month,
    label: monthLabel(month),
    partial: now < end, // month still in progress
    generatedAt: now.toISOString(),
    generatedBy,
    reports,
  };
}

// Every month from the first complaint up to (and including) the current one.
function monthsAvailable(complaints, now = new Date()) {
  const dates = complaints.map((c) => new Date(c.createdAt)).filter((d) => !Number.isNaN(d.getTime()));
  const current = monthKey(now);
  if (!dates.length) return [current];
  const first = monthKey(new Date(Math.min(...dates)));
  const months = [];
  let cursor = first;
  while (cursor <= current) {
    months.push(cursor);
    const { end } = monthRange(cursor);
    cursor = monthKey(end);
  }
  return months;
}

module.exports = { buildBundle, monthsAvailable, monthLabel, monthKey, isValidMonth, previousMonth };
