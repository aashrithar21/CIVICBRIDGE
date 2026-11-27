// Keep in sync with backend/src/utils/departments.js
export const STAFF_DEPARTMENTS = [
  'Public Works Department',
  'Sanitation Department',
  'Water Supply Department',
  'Electrical Department',
  'Drainage Department',
  'General Administration',
] as const

export const ADMIN_DEPARTMENT = 'City Administration'

export const ALL_DEPARTMENTS: string[] = [...STAFF_DEPARTMENTS, ADMIN_DEPARTMENT]
