
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const impactRoutes = require("./routes/impactRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { startReportScheduler } = require("./utils/reportScheduler");

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: "5mb" }));

// Serve uploaded complaint images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CivicBridge API",
    tagline: "Connecting Citizens. Improving Cities.",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CivicBridge backend is running!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.listen(PORT, () => {
  console.log(`CivicBridge server running at http://localhost:${PORT}`);
  startReportScheduler();
});
