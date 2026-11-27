import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Building2, ClipboardCheck, FileText, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/ui/Logo'
import AuthTabs from '../components/ui/AuthTabs'
import { STAFF_DEPARTMENTS, ADMIN_DEPARTMENT } from '../utils/departments'

export default function DepartmentLogin() {
  const { departmentLogin } = useAuth()
  const navigate = useNavigate()

  const [department, setDepartment] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!department) {
      setError('Please select your department.')
      return
    }

    setLoading(true)

    try {
      const user = await departmentLogin(department, email.trim(), password)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard')
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Unable to login. Check your details.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth">
      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-grid-art" />
        <Logo size={44} />
        <h2>Fix it, <em>prove it</em>, close it.</h2>
        <ul className="auth-points">
          <li><ClipboardCheck size={20} /> Manage the complaints routed to your department</li>
          <li><FileText size={20} /> Monthly performance reports, generated automatically</li>
          <li><ShieldCheck size={20} /> Accounts are issued by city administration</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-form">
          <AuthTabs active="department" />
          <p className="eyebrow">Department portal</p>
          <h1>Department sign in</h1>
          <p className="lede">Choose your department, then sign in with your official account.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="dept-department" className="label">Department</label>
              <div className="input-wrap">
                <Building2 size={18} aria-hidden="true" />
                <select
                  id="dept-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your department</option>
                  {STAFF_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  <option value={ADMIN_DEPARTMENT}>{ADMIN_DEPARTMENT} (administrators)</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="dept-email" className="label">Official email</label>
              <div className="input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="dept-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@department.gov"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="dept-password" className="label">Password</label>
              <div className="input-wrap">
                <Lock size={18} aria-hidden="true" />
                <input
                  id="dept-password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
                  {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && <p role="alert" className="alert" style={{ marginTop: 20 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary" aria-busy={loading}>
              {loading ? 'Signing in…' : 'Sign in to department'}
            </button>
          </form>

          <p className="auth-foot">
            Not city staff? <Link to="/login">Citizen login</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
