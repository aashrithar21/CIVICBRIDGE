export const API_ORIGIN = 'http://localhost:5000'

/** Build an absolute URL for an uploaded file path returned by the API. */
export const assetUrl = (path?: string | null) => (path ? `${API_ORIGIN}${path}` : '')

export type StatusTone = 'resolved' | 'progress' | 'pending' | 'rejected'

export function statusTone(status: string): StatusTone {
  if (status === 'Resolved') return 'resolved'
  if (status === 'In Progress') return 'progress'
  if (status === 'Rejected') return 'rejected'
  return 'pending'
}

export function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function byNewest<T extends { createdAt: string }>(a: T, b: T) {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt)
}

export const pageTitles: Record<string, string> = {
  '': 'CivicBridge — Better streets, stronger communities',
  login: 'Sign in',
  department: 'Department sign in',
  register: 'Create account',
  explore: 'Explore issues',
  issues: 'Report details',
  report: 'Report an issue',
  map: 'City map',
  transparency: 'Transparency',
  citizen: 'Your workspace',
  staff: 'Staff workspace',
  admin: 'Admin workspace',
}
