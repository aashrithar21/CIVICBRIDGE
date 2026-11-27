import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../ui/Logo'

const links = [
  { name: 'Home', path: '/', end: true },
  { name: 'Explore issues', path: '/explore', end: false },
  { name: 'City map', path: '/map', end: false },
  { name: 'Transparency', path: '/transparency', end: false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const dashboardPath =
    user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'staff' ? '/staff/dashboard' : '/citizen/dashboard'
  const showReport = !user || user.role === 'citizen'

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // Header gains a divider once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the drawer and returns focus to its toggle.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="container nav" aria-label="Main">
        <Link to="/" className="brand" aria-label="CivicBridge home">
          <Logo />
          <span>
            <span className="brand-name">CivicBridge</span>
            <span className="brand-tag">Connecting citizens. Improving cities.</span>
          </span>
        </Link>

        <div className="nav-links">
          {links.map((l) => (
            <NavLink key={l.path} to={l.path} end={l.end} className="nav-link">
              {l.name}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user" title={user.name}>{user.name}</span>
              <Link to={dashboardPath} className="btn btn-outline btn-sm">
                <LayoutDashboard size={16} aria-hidden="true" /> Dashboard
              </Link>
              <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: 'var(--ink-2)' }}>
                <LogOut size={16} aria-hidden="true" /> Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: 'var(--ink)' }}>Log in</Link>
          )}
          {showReport && (
            <Link to={user ? '/report' : '/register'} className="btn btn-primary btn-sm">
              {user ? 'Report an issue' : 'Get started'} <ArrowRight size={16} aria-hidden="true" className="arrow" />
            </Link>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-navigation" className="drawer">
          {links.map((l) => (
            <NavLink key={l.path} to={l.path} end={l.end}>
              {l.name}
              <ArrowRight size={18} aria-hidden="true" />
            </NavLink>
          ))}
          {user ? (
            <>
              <Link to={dashboardPath}>Dashboard <LayoutDashboard size={18} aria-hidden="true" /></Link>
              <button type="button" onClick={handleLogout} className="drawer-item">Log out <LogOut size={18} aria-hidden="true" /></button>
            </>
          ) : (
            <Link to="/login">Log in <ArrowRight size={18} aria-hidden="true" /></Link>
          )}
          {showReport && (
            <Link to={user ? '/report' : '/register'} className="btn btn-primary">
              {user ? 'Report an issue' : 'Create a free account'}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
