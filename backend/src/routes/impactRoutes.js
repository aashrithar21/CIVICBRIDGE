const express = require("express");
const { readData } = require("../utils/fileStore");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { computeImpact, buildLeaderboard, POINTS, LEVELS } = require("../utils/impact");

const router = express.Router();

// Logged-in citizen's own Civic Impact Score, badges and points breakdown
router.get("/me", authenticateToken, authorizeRoles("citizen"), async (req, res) => {
  try {
    const complaints = await readData("complaints.json");
    return res.json({
      success: true,
      impact: computeImpact(req.user.id, complaints),
      rules: { points: POINTS, levels: LEVELS },
    });
  } catch (error) {
    console.error("Impact score error:", error);
    return res.status(500).json({ success: false, message: "Unable to calculate your impact score" });
  }
});

// Top citizens (first name + initial only)
router.get("/leaderboard", authenticateToken, authorizeRoles("citizen"), async (req, res) => {
  try {
    const [users, complaints] = await Promise.all([
      readData("users.json"),
      readData("complaints.json"),
    ]);
    return res.json({ success: true, ...buildLeaderboard(users, complaints, req.user.id) });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ success: false, message: "Unable to load the leaderboard" });
  }
});

module.exports = router;
