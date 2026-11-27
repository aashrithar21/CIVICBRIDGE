// Automated monthly reports: finished months are generated and stored without anyone clicking anything.
// Runs at server start and then every few hours, so a report appears as soon as a month ends
// (and any month missed while the server was off is filled in on the next start).

const { readData, writeData } = require("./fileStore");
const { buildBundle, monthsAvailable, monthKey } = require("./monthlyReport");

const FILE = "monthly-reports.json";
const CHECK_EVERY_MS = 6 * 60 * 60 * 1000;

// Serialises writes so two requests can't overwrite each other's changes.
let queue = Promise.resolve();
function withLock(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

async function getStored(month) {
  const stored = await readData(FILE);
  return stored.find((b) => b.month === month) || null;
}

async function saveBundle(bundle) {
  return withLock(async () => {
    const stored = await readData(FILE);
    const next = stored.filter((b) => b.month !== bundle.month);
    next.push(bundle);
    next.sort((a, b) => b.month.localeCompare(a.month));
    await writeData(FILE, next);
    return bundle;
  });
}

// Generate every finished month that has no stored report yet.
async function generateMissingReports(now = new Date()) {
  const complaints = await readData("complaints.json");
  const current = monthKey(now);
  const finished = monthsAvailable(complaints, now).filter((m) => m < current);
  const created = [];

  for (const month of finished) {
    if (!(await getStored(month))) {
      await saveBundle(buildBundle(complaints, month, { now, generatedBy: "system" }));
      created.push(month);
    }
  }
  return created;
}

function startReportScheduler() {
  const run = () =>
    generateMissingReports()
      .then((created) => {
        if (created.length) console.log(`Monthly reports generated: ${created.join(", ")}`);
      })
      .catch((error) => console.error("Monthly report generation failed:", error.message));

  run();
  const timer = setInterval(run, CHECK_EVERY_MS);
  timer.unref(); // don't keep the process alive just for this
}

module.exports = { startReportScheduler, generateMissingReports, getStored, saveBundle };
