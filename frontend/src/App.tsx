import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { LineSkeleton } from './components/ui/States'
import { useAuth } from './hooks/useAuth'
import { pageTitles } from './utils/helpers'

// Route-level code splitting keeps the first paint light.
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const DepartmentLogin = lazy(() => import('./pages/DepartmentLogin'))
const Register = lazy(() => import('./pages/Register'))
const ExploreIssues = lazy(() => import('./pages/ExploreIssues'))
const IssueDetails = lazy(() => import('./pages/IssueDetails'))
const ReportIssue = lazy(() => import('./pages/ReportIssue'))
const CityMap = lazy(() => import('./pages/CityMap'))
const Transparency = lazy(() => import('./pages/Transparency'))
const CitizenDashboard = lazy(() => import('./pages/citizen/CitizenDashboard'))
const MyComplaints = lazy(() => import('./pages/citizen/MyComplaints'))
const ImpactScore = lazy(() => import('./pages/citizen/ImpactScore'))
const MonthlyReports = lazy(() => import('./pages/staff/MonthlyReports'))
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function PageFallback() {
  return (
    <main className="page container" aria-busy="true">
      <div className="skeleton" style={{ height: 44, width: 'min(420px, 70%)', marginBottom: 28 }} />
      <LineSkeleton rows={3} />
    </main>
  )
}

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth()
  const { pathname } = useLocation()

  if (loading) return <PageFallback />
  if (!user) {
    const departmentArea = pathname.startsWith('/staff') || pathname.startsWith('/admin')
    return <Navigate to={departmentArea ? '/department/login' : '/login'} replace />
  }
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />

  return <>{children}</>
}

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const first = pathname.split('/').filter(Boolean)[0] ?? ''
    const name = pageTitles[first]
    document.title = first === '' ? (name as string) : `${name ?? first} | CivicBridge`
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <a className="skip-link" href="#page-content">Skip to content</a>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <div id="page-content" tabIndex={-1} className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/department/login" element={<DepartmentLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<ExploreIssues />} />
              <Route path="/issues/:id" element={<IssueDetails />} />
              <Route path="/report" element={<ProtectedRoute roles={['citizen']}><ReportIssue /></ProtectedRoute>} />
              <Route path="/map" element={<CityMap />} />
              <Route path="/transparency" element={<Transparency />} />

              <Route path="/citizen/dashboard" element={<ProtectedRoute roles={['citizen']}><CitizenDashboard /></ProtectedRoute>} />
              <Route path="/citizen/complaints" element={<ProtectedRoute roles={['citizen']}><MyComplaints /></ProtectedRoute>} />
              <Route path="/citizen/impact" element={<ProtectedRoute roles={['citizen']}><ImpactScore /></ProtectedRoute>} />
              <Route path="/staff/dashboard" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

              <Route path="/staff/reports" element={<ProtectedRoute roles={['staff']}><MonthlyReports /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><MonthlyReports /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
