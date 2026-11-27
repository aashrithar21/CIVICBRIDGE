import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, MapPin, CheckCircle, Users } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/ui/Logo'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      })
      navigate('/citizen/dashboard')
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Unable to create account.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { id: 'name', label: 'Full name', value: name, change: setName, type: 'text', placeholder: 'Enter your full name', icon: User, auto: 'name', required: true },
    { id: 'email', label: 'Email address', value: email, change: setEmail, type: 'email', placeholder: 'you@example.com', icon: Mail, auto: 'email', required: true },
    { id: 'phone', label: 'Phone number', value: phone, change: setPhone, type: 'tel', placeholder: 'Enter your phone number', icon: Phone, auto: 'tel', required: false },
    { id: 'password', label: 'Password', value: password, change: setPassword, type: 'password', placeholder: 'At least 8 characters', icon: Lock, auto: 'new-password', required: true },
    { id: 'confirm', label: 'Confirm password', value: confirmPassword, change: setConfirmPassword, type: 'password', placeholder: 'Repeat your password', icon: Lock, auto: 'new-password', required: true },
  ]

  return (
    <main className="auth">
      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-grid-art" />
        <Logo size={44} />
        <h2>Join your <em>neighbours</em> in fixing the city.</h2>
        <ul className="auth-points">
          <li><MapPin size={20} /> Report issues with a photo and exact location</li>
          <li><CheckCircle size={20} /> Track progress and verify repairs</li>
          <li><Users size={20} /> Support reports that matter to your area</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-form">
          <p className="eyebrow">Free for every citizen</p>
          <h1>Create your account</h1>
          <p className="lede">Join your community with CivicBridge.</p>

          <form onSubmit={handleSubmit}>
            {fields.map((f) => {
              const Icon = f.icon
              const isPwd = f.type === 'password'
              return (
                <div className="field" key={f.id}>
                  <label htmlFor={`register-${f.id}`} className="label">
                    {f.label}{!f.required && <span className="opt"> (optional)</span>}
                  </label>
                  <div className="input-wrap">
                    <Icon size={18} aria-hidden="true" />
                    <input
                      id={`register-${f.id}`}
                      type={isPwd && show ? 'text' : f.type}
                      value={f.value}
                      onChange={(e) => f.change(e.target.value)}
                      placeholder={f.placeholder}
                      autoComplete={f.auto}
                      required={f.required}
                      minLength={isPwd ? 8 : undefined}
                    />
                    {f.id === 'password' && (
                      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide passwords' : 'Show passwords'} aria-pressed={show}>
                        {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {error && <p role="alert" className="alert" style={{ marginTop: 20 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary" aria-busy={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
