const express = require("express");
const { readData } = require("../utils/fileStore");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { ALL_DEPARTMENTS } = require("../utils/departments");
const {
  buildBundle,
  monthsAvailable,
  monthLabel,
  monthKey,
  isValidMonth,
} = require("../utils/monthlyReport");
const { generateMissingReports, getStored, saveBundle } = require("../utils/reportScheduler");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("staff", "admin"));

// Which department's numbers this person may see. Staff: their own. Admin: everything, or one by ?department=
async function resolveScope(req) {
  if (req.user.role === "admin") {
    const requested = req.query.department;
    if (!requested || requested === "ALL") return { scope: "ALL" };
    if (!ALL_DEPARTMENTS.includes(requested)) return { error: "Unknown department" };
    return { scope: requested };
  }
  const users = await readData("users.json");
  const account = users.find((u) => u.id === req.user.id);
  if (!account || !account.department) return { error: "Your account has no department assigned" };
  return { scope: account.department };
}

function pickReport(bundle, scope) {
  // A department with no complaints has no entry; fall back to an empty-looking city report is wrong,
  // so say so explicitly.
  return bundle.reports[scope] || null;
}

// List of months with reports
router.get("/monthly", async (req, res) => {
  try {
    const now = new Date();
    const complaints = await readData("complaints.json");
    await generateMissingReports(now);
    const current = monthKey(now);
    const months = monthsAvailable(complaints, now)
      .sort((a, b) => b.localeCompare(a))
      .map((month) => ({ month, label: monthLabel(month), partial: month === current }));
    return res.json({ success: true, months });
  } catch (error) {
    console.error("Report list error:", error);
    return res.status(500).json({ success: false, message: "Unable to load reports" });
  }
});

// One month's report
router.get("/monthly/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const now = new Date();

    if (!isValidMonth(month) || month > monthKey(now)) {
      return res.status(400).json({ success: false, message: "Choose a valid month that is not in the future" });
    }

    const { scope, error } = await resolveScope(req);
    if (error) return res.status(error.startsWith("Your") ? 403 : 400).json({ success: false, message: error });

    const complaints = await readData("complaints.json");
    const isCurrent = month === monthKey(now);

    // Finished months are served from the stored (automatically generated) snapshot.
    let bundle = isCurrent ? null : await getStored(month);
    let source = "stored";
    if (!bundle) {
      bundle = buildBundle(complaints, month, { now, generatedBy: "system" });
      source = isCurrent ? "live" : "generated";
      if (!isCurrent) await saveBundle(bundle);
    }

    const report = pickReport(bundle, scope);
    if (!report) {
      return res.json({
        success: true,
        empty: true,
        message: `No reports were filed for ${scope} in ${bundle.label}.`,
        month,
        label: bundle.label,
        scope,
      });
    }

    return res.json({
      success: true,
      report,
      partial: bundle.partial,
      source,
      generatedAt: bundle.generatedAt,
      generatedBy: bundle.generatedBy,
    });
  } catch (error) {
    console.error("Monthly report error:", error);
    return res.status(500).json({ success: false, message: "Unable to build the report" });
  }
});

// Admin: rebuild a finished month's stored report (e.g. after data corrections)
router.post("/monthly/:month/regenerate", authorizeRoles("admin"), async (req, res) => {
  try {
    const { month } = req.params;
    const now = new Date();
    if (!isValidMonth(month) || month >= monthKey(now)) {
      return res.status(400).json({ success: false, message: "Only finished months can be regenerated" });
    }
    const complaints = await readData("complaints.json");
    const bundle = await saveBundle(buildBundle(complaints, month, { now, generatedBy: `admin:${req.user.name}` }));
    return res.json({ success: true, message: `${bundle.label} report regenerated`, generatedAt: bundle.generatedAt });
  } catch (error) {
    console.error("Report regeneration error:", error);
    return res.status(500).json({ success: false, message: "Unable to regenerate the report" });
  }
});

module.exports = router;
