const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const { readData, writeData } = require("../utils/fileStore");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  STAFF_DEPARTMENTS,
  ADMIN_DEPARTMENT,
  ALL_DEPARTMENTS,
} = require("../utils/departments");

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department || null,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Returns the user when email + password are correct, otherwise null.
async function checkCredentials(email, password) {
  const users = await readData("users.json");
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);
  if (!user) return null;
  const matches = await bcrypt.compare(password, user.password);
  return matches ? user : null;
}

function hasCredentials(body) {
  const { email, password } = body || {};
  return (
    typeof email === "string" &&
    typeof password === "string" &&
    email.trim() &&
    password
  );
}

// Public list used by the department login form
router.get("/departments", (req, res) => {
  res.json({
    success: true,
    departments: STAFF_DEPARTMENTS,
    adminDepartment: ADMIN_DEPARTMENT,
  });
});

// Citizen registration (citizens only; staff/admin accounts are created by an administrator)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (![name, email, password].every(v => typeof v === "string" && v.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    const users = await readData("users.json");
    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = users.find(
      (user) => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      phone: phone ? String(phone).trim() : "",
      password: hashedPassword,
      role: "citizen",
      department: null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeData("users.json", users);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token: signToken(newUser),
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
});

// Citizen login — accepts citizen accounts only
router.post("/citizen/login", async (req, res) => {
  try {
    if (!hasCredentials(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await checkCredentials(req.body.email, req.body.password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role !== "citizen") {
      return res.status(403).json({
        success: false,
        message: "This is a department account. Please use the Department login.",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Citizen login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
});

// Department login — staff/admin only, and the chosen department must match the account
router.post("/department/login", async (req, res) => {
  try {
    if (!hasCredentials(req.body) || typeof req.body.department !== "string") {
      return res.status(400).json({
        success: false,
        message: "Department, email and password are required",
      });
    }

    const department = req.body.department.trim();

    if (!ALL_DEPARTMENTS.includes(department)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid department",
      });
    }

    const user = await checkCredentials(req.body.email, req.body.password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role === "citizen") {
      return res.status(403).json({
        success: false,
        message: "This is a citizen account. Please use the Citizen login.",
      });
    }

    if (!user.department || user.department !== department) {
      return res.status(403).json({
        success: false,
        message: "This account is not registered under the selected department.",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Department login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
});

// Get currently logged-in user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const users = await readData("users.json");
    const user = users.find((item) => item.id === req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve profile",
    });
  }
});

module.exports = router;
