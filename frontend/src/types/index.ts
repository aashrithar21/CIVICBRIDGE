
export type UserRole = 'citizen' | 'staff' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  department: string | null
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface ComplaintUpdate {
  status: string
  message: string
  updatedAt: string
  updatedBy?: string
}

export interface Complaint {
  id: string
  complaintNumber: string
  title: string
  description: string
  category: string
  department: string
  address: string
  latitude: number | null
  longitude: number | null
  image: string | null
  reportedBy: string
  citizenName: string
  status: string
  priorityScore?: number
  overdue?: boolean
  escalated?: boolean
  verified?: boolean
  repairRating?: number
  resolutionImage?: string
  priority: string
  supporters: string[]
  updates: ComplaintUpdate[]
  createdAt: string
  updatedAt: string
}

export interface ComplaintResponse {
  success: boolean
  count?: number
  message?: string
  complaints?: Complaint[]
  complaint?: Complaint
  supportCount?: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

export interface ImpactBadge {
  id: string
  name: string
  icon: string
  description: string
  earned: boolean
  progress: number
  target: number
}

export interface ImpactBreakdownItem {
  key: string
  label: string
  count: number
  points: number
}

export interface ImpactSummary {
  score: number
  level: string
  levelMin: number
  nextLevel: { name: string; min: number } | null
  pointsToNext: number
  levelProgress: number
  breakdown: ImpactBreakdownItem[]
  badges: ImpactBadge[]
  badgesEarned: number
  stats: { reports: number; resolved: number; supportsGiven: number; supportsReceived: number }
}

export interface LeaderboardRow {
  rank: number
  name: string
  score: number
  level: string
  badgesEarned: number
  isYou: boolean
}

export interface ReportMetrics {
  received: number
  resolved: number
  rejected: number
  reopened: number
  backlogIn: number
  openAtEnd: number
  overdueAtEnd: number
  escalatedAtEnd: number
  resolutionRate: number | null
  onTimeRate: number | null
  avgResolutionDays: number | null
  communitySupports: number
  verifiedRepairs: number
  avgRepairRating: number | null
  handled: number
}

export type PerformanceRating = 'Good' | 'Fair' | 'Needs attention' | 'No activity'

export interface DepartmentReport extends ReportMetrics {
  department: string
  rating: PerformanceRating
}

export interface CategoryReport {
  category: string
  received: number
  resolved: number
  openAtEnd: number
  avgResolutionDays: number | null
}

export interface MonthlyReport {
  month: string
  label: string
  scope: string
  periodStart: string
  periodEnd: string
  asOf: string
  summary: ReportMetrics & { rating: PerformanceRating }
  previous: ReportMetrics | null
  departments: DepartmentReport[]
  categories: CategoryReport[]
  highlights: string[]
  targets: { overdueDays: number; escalationDays: number }
}

export interface ReportMonth {
  month: string
  label: string
  partial: boolean
}
