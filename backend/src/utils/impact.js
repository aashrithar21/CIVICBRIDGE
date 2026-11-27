// Civic Impact Score — derived from stored complaint data, so it is always consistent
// with the real records (nothing to sync, nothing to cheat by editing a counter).

const POINTS = {
  report: 10,        // a report that is not rejected
  photo: 5,          // the report includes a photograph
  resolved: 20,      // the report was resolved
  verified: 10,      // the citizen verified the repair and rated it
  supportGiven: 3,   // supporting another citizen's report
  supportReceived: 2 // each supporter on your report ...
};

const SUPPORT_GIVEN_CAP = 20;    // supports that earn points
const SUPPORT_RECEIVED_CAP = 5;  // supporters per report that earn points

const LEVELS = [
  { name: "Newcomer", min: 0 },
  { name: "Contributor", min: 25 },
  { name: "Active Citizen", min: 75 },
  { name: "Community Champion", min: 150 },
  { name: "City Guardian", min: 300 },
];

function computeImpact(userId, complaints) {
  const mine = complaints.filter((c) => c.reportedBy === userId);
  const counted = mine.filter((c) => c.status !== "Rejected");

  const withPhoto = counted.filter((c) => c.image);
  const resolved = counted.filter((c) => c.status === "Resolved");
  const verified = resolved.filter((c) => c.verified);
  const supportsGiven = complaints.filter(
    (c) => c.reportedBy !== userId && (c.supporters || []).includes(userId)
  ).length;
  const supportsReceived = counted.reduce(
    (sum, c) => sum + Math.min(SUPPORT_RECEIVED_CAP, (c.supporters || []).length),
    0
  );
  const categories = new Set(counted.map((c) => c.category));
  const mostSupported = counted.reduce(
    (max, c) => Math.max(max, (c.supporters || []).length),
    0
  );

  const breakdown = [
    { key: "report", label: "Reports submitted", count: counted.length, points: counted.length * POINTS.report },
    { key: "photo", label: "Reports with a photo", count: withPhoto.length, points: withPhoto.length * POINTS.photo },
    { key: "resolved", label: "Reports resolved", count: resolved.length, points: resolved.length * POINTS.resolved },
    { key: "verified", label: "Repairs verified", count: verified.length, points: verified.length * POINTS.verified },
    {
      key: "supportGiven",
      label: "Neighbours’ reports supported",
      count: Math.min(supportsGiven, SUPPORT_GIVEN_CAP),
      points: Math.min(supportsGiven, SUPPORT_GIVEN_CAP) * POINTS.supportGiven,
    },
    { key: "supportReceived", label: "Supporters on your reports", count: supportsReceived, points: supportsReceived * POINTS.supportReceived },
  ];

  const score = breakdown.reduce((sum, item) => sum + item.points, 0);

  const badgeDefs = [
    { id: "first-report", name: "First Report", icon: "flag", description: "Submit your first report", value: counted.length, target: 1 },
    { id: "neighbourhood-watch", name: "Neighbourhood Watch", icon: "shield", description: "Submit 5 reports", value: counted.length, target: 5 },
    { id: "photo-witness", name: "Photo Witness", icon: "camera", description: "Add a photo to 3 reports", value: withPhoto.length, target: 3 },
    { id: "all-rounder", name: "All-Rounder", icon: "layers", description: "Report issues in 3 different categories", value: categories.size, target: 3 },
    { id: "community-voice", name: "Community Voice", icon: "megaphone", description: "Support 5 neighbours’ reports", value: supportsGiven, target: 5 },
    { id: "crowd-favourite", name: "Crowd Favourite", icon: "heart", description: "Get 3 supporters on one report", value: mostSupported, target: 3 },
    { id: "problem-solver", name: "Problem Solver", icon: "check", description: "Have 3 of your reports resolved", value: resolved.length, target: 3 },
    { id: "repair-verifier", name: "Repair Verifier", icon: "star", description: "Verify and rate a completed repair", value: verified.length, target: 1 },
  ];

  const badges = badgeDefs.map((b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon,
    description: b.description,
    earned: b.value >= b.target,
    progress: Math.min(b.value, b.target),
    target: b.target,
  }));

  let levelIndex = 0;
  LEVELS.forEach((level, index) => {
    if (score >= level.min) levelIndex = index;
  });
  const current = LEVELS[levelIndex];
  const next = LEVELS[levelIndex + 1] || null;

  return {
    score,
    level: current.name,
    levelMin: current.min,
    nextLevel: next ? { name: next.name, min: next.min } : null,
    pointsToNext: next ? next.min - score : 0,
    levelProgress: next ? Math.round(((score - current.min) / (next.min - current.min)) * 100) : 100,
    breakdown,
    badges,
    badgesEarned: badges.filter((b) => b.earned).length,
    stats: {
      reports: counted.length,
      resolved: resolved.length,
      supportsGiven,
      supportsReceived: counted.reduce((sum, c) => sum + (c.supporters || []).length, 0),
    },
  };
}

// "Test Citizen" -> "Test C." so the public leaderboard shows no full names.
function displayName(name) {
  const parts = String(name || "Citizen").trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

function buildLeaderboard(users, complaints, currentUserId, limit = 10) {
  const ranked = users
    .filter((u) => u.role === "citizen")
    .map((u) => {
      const impact = computeImpact(u.id, complaints);
      return {
        id: u.id,
        name: displayName(u.name),
        score: impact.score,
        level: impact.level,
        badgesEarned: impact.badgesEarned,
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  let rank = 0;
  let previousScore = null;
  const rows = ranked.map((row, index) => {
    if (row.score !== previousScore) rank = index + 1; // ties share a rank
    previousScore = row.score;
    return { ...row, rank, isYou: row.id === currentUserId };
  });

  // Never expose other citizens' ids.
  const strip = ({ id, ...rest }) => rest;
  const top = rows.slice(0, limit);
  const you = rows.find((row) => row.isYou);

  return {
    leaderboard: top.map(strip),
    you: you && !top.includes(you) ? strip(you) : null,
  };
}

module.exports = { computeImpact, buildLeaderboard, POINTS, LEVELS, SUPPORT_GIVEN_CAP, SUPPORT_RECEIVED_CAP };
