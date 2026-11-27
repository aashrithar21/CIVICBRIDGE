import { Link } from 'react-router-dom'
import { User, Building2 } from 'lucide-react'

/** Switches between the two separate sign-in portals. */
export default function AuthTabs({ active }: { active: 'citizen' | 'department' }) {
  return (
    <nav className="auth-tabs" aria-label="Choose sign-in type">
      <Link to="/login" aria-current={active === 'citizen' ? 'page' : undefined} className={active === 'citizen' ? 'is-active' : ''}>
        <User size={16} aria-hidden="true" /> Citizen
      </Link>
      <Link to="/department/login" aria-current={active === 'department' ? 'page' : undefined} className={active === 'department' ? 'is-active' : ''}>
        <Building2 size={16} aria-hidden="true" /> Department
      </Link>
    </nav>
  )
}
