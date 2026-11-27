import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, MapPin, CheckCircle, Users } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/ui/Logo'
import AuthTabs from '../components/ui/AuthTabs'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email.trim(), password)

      if (user.role !== 'citizen') {
        // The server only accepts citizen accounts here; this is a safeguard.
        setError('Please use the Department login for staff accounts.')
        return
      }
      navigate('/citizen/dashboard')
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
        <h2>Your city, <em>one report</em> at a time.</h2>
        <ul className="auth-points">
          <li><MapPin size={20} /> Pin issues precisely with GPS or the map</li>
          <li><CheckCircle size={20} /> Follow every status update in public</li>
          <li><Users size={20} /> Back your neighbours’ reports to raise priority</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-form">
          <AuthTabs active="citizen" />
          <p className="eyebrow">Citizen portal</p>
          <h1>Sign in</h1>
          <p className="lede">Report issues, track repairs and earn your Civic Impact Score.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-email" className="label">Email address</label>
              <div className="input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password" className="label">Password</label>
              <div className="input-wrap">
                <Lock size={18} aria-hidden="true" />
                <input
                  id="login-password"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-foot">
            Don’t have an account? <Link to="/register">Create account</Link>
            <br />
            City staff? <Link to="/department/login">Department login</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
