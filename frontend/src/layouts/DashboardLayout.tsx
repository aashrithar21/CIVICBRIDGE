import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FilePlus2, ClipboardList, Search, Trophy, FileText } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth()

  const links =
    user?.role === 'citizen'
      ? [
          { to: '/citizen/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/report', label: 'Report an issue', icon: FilePlus2 },
          { to: '/citizen/complaints', label: 'My complaints', icon: ClipboardList },
          { to: '/citizen/impact', label: 'Impact score', icon: Trophy },
          { to: '/explore', label: 'Explore issues', icon: Search },
        ]
      : [
          { to: user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: user?.role === 'admin' ? '/admin/reports' : '/staff/reports', label: 'Monthly reports', icon: FileText },
          { to: '/explore', label: 'All complaints', icon: ClipboardList },
        ]

  return (
    <main className="page container">
      <div className="work-head no-print">
        <p className="eyebrow">CivicBridge workspace</p>
        <h1>{title}</h1>
        <p className="hello">
          Welcome back, {user?.name}.
          {user?.role !== 'citizen' && user?.department && <span className="dept-pill">{user.department}</span>}
        </p>
      </div>

      <div className="work">
        <nav className="card side-nav no-print" aria-label="Workspace">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={18} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
        <section className="min-w-0" aria-label={title}>{children}</section>
      </div>
    </main>
  )
}
