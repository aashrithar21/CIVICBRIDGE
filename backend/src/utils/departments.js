// Single source of truth for departments.
// Each complaint category is routed to exactly one department.
const departmentMap = {
  "Road Damage": "Public Works Department",
  "Garbage": "Sanitation Department",
  "Water Leakage": "Water Supply Department",
  "Streetlight": "Electrical Department",
  "Drainage": "Drainage Department",
  "Other": "General Administration",
};

// Departments that staff accounts can belong to.
const STAFF_DEPARTMENTS = Array.from(new Set(Object.values(departmentMap)));

// Admin accounts belong to the city-wide administration, which can see every department.
const ADMIN_DEPARTMENT = "City Administration";

const ALL_DEPARTMENTS = [...STAFF_DEPARTMENTS, ADMIN_DEPARTMENT];

module.exports = { departmentMap, STAFF_DEPARTMENTS, ADMIN_DEPARTMENT, ALL_DEPARTMENTS };
