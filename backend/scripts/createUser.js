
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const { readData, writeData } = require("../src/utils/fileStore");
const { STAFF_DEPARTMENTS, ADMIN_DEPARTMENT } = require("../src/utils/departments");

async function createUser() {
  const name = process.argv[2];
  const email = process.argv[3]?.toLowerCase();
  const password = process.argv[4];
  const role = process.argv[5];
  const department = role === "admin" ? ADMIN_DEPARTMENT : process.argv[6];

  if (!name || !email || !password || !role) {
    console.log(
      'Usage: node scripts/createUser.js "Name" "email" "password" "staff" "Department Name"\n       node scripts/createUser.js "Name" "email" "password" "admin"\nDepartments: ' + STAFF_DEPARTMENTS.join(", ")
    );
    process.exit(1);
  }

  if (!["staff", "admin"].includes(role)) {
    console.log("Role must be staff or admin.");
    process.exit(1);
  }

  if (role === "staff" && !STAFF_DEPARTMENTS.includes(department)) {
    console.log("Staff accounts need a department. Choose one of: " + STAFF_DEPARTMENTS.join(", "));
    process.exit(1);
  }

  if (password.length < 8) {
    console.log("Password must contain at least 8 characters.");
    process.exit(1);
  }

  try {
    const users = await readData("users.json");

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email
    );

    if (existingUser) {
      console.log("A user with this email already exists.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: randomUUID(),
      name,
      email,
      phone: "",
      password: hashedPassword,
      role,
      department,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeData("users.json", users);

    console.log(`${role.toUpperCase()} account created successfully.`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Department: ${department}`);
  } catch (error) {
    console.error("Could not create account:", error.message);
    process.exitCode = 1;
  }
}

createUser();
