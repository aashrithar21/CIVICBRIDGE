import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, CalendarDays, Heart, Copy, ExternalLink, Check } from 'lucide-react'
import axios from 'axios'
import api, { complaintAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import type { Complaint } from '../types'
import { assetUrl, formatDate, formatDateTime } from '../utils/helpers'
import StatusBadge from '../components/ui/StatusBadge'
import { LineSkeleton } from '../components/ui/States'

export default function IssueDetails() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setLoading(true)
    complaintAPI.getOne(id)
      .then((res) => setComplaint(res.data.complaint))
      .catch(() => setMessage('Unable to find this complaint.'))
      .finally(() => setLoading(false))
  }, [id])

  async function supportComplaint() {
    if (!user) {
      setMessage('Please log in to support this complaint.')
      return
    }

    try {
      const response = await complaintAPI.support(id)
      setComplaint((current) => current ? {
        ...current,
        supporters: [...(current.supporters || []), user.id],
      } : current)
      setMessage(response.data.message)
    } catch (err: unknown) {
      setMessage(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Unable to record support.'
          : 'Something went wrong.',
      )
    }
  }

  if (loading) {
    return (
      <main className="page container" aria-busy="true">
        <div className="skeleton" style={{ height: 24, width: 140, marginBottom: 24 }} />
        <LineSkeleton rows={3} />
      </main>
    )
  }

  if (!complaint) {
    return (
      <main className="page container">
        <div className="state state--error" role="alert">
          <div><strong>{message || 'Complaint not found.'}</strong><p>It may have been removed, or the link is incorrect.</p></div>
          <Link to="/explore" className="btn btn-primary btn-sm">Back to issues</Link>
        </div>
      </main>
    )
  }

  async function review(action: string, rating?: number) {
    try {
      const r = await api.post(`/complaints/${id}/review`, { action, rating })
      setComplaint(r.data.complaint)
      setMessage(r.data.message)
    } catch {
      setMessage('Unable to save review.')
    }
  }
  async function proof(file: File) {
    try {
      const data = new FormData()
      data.append('image', file)
      const r = await api.post(`/complaints/${id}/proof`, data)
      setComplaint(r.data.complaint)
      setMessage(r.data.message)
    } catch {
      setMessage('Unable to upload repair photo.')
    }
  }

  const alreadySupported = Boolean(user && complaint.supporters?.includes(user.id))
  const ownComplaint = user?.id === complaint.reportedBy
  const score = Math.max(0, Math.min(100, complaint.priorityScore ?? 0))
  const hasCoords = complaint.latitude != null && complaint.longitude != null

  return (
    <main className="page container">
      <Link to="/explore" className="back"><ArrowLeft size={17} aria-hidden="true" /> Back to issues</Link>

      <div className="detail">
        <article className="card" style={{ overflow: 'hidden' }}>
          {complaint.image && <img src={assetUrl(complaint.image)} alt={complaint.title} className="detail-hero" />}
          <div className="detail-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span className="kicker">{complaint.category}</span>
              <StatusBadge status={complaint.status} />
            </div>

            <h1>{complaint.title}</h1>
            <span className="ref">Ref · {complaint.complaintNumber}</span>
            <p className="detail-desc">{complaint.description}</p>

            <dl className="facts">
              <div><dt><MapPin size={16} aria-hidden="true" /> Location</dt><dd>{complaint.address}</dd></div>
              <div><dt><CalendarDays size={16} aria-hidden="true" /> Reported</dt><dd>{formatDate(complaint.createdAt)}</dd></div>
              <div><dt>Assigned department</dt><dd>{complaint.department}</dd></div>
              <div><dt>Priority</dt><dd>{complaint.priority}</dd></div>
            </dl>

            {complaint.complaintNumber.startsWith('CB-DEMO-') && (
              <p className="help" style={{ marginTop: 14 }}>Sample report — illustrative location and status.</p>
            )}

            <section aria-labelledby="timeline-title" style={{ marginTop: 40 }}>
              <h2 id="timeline-title" className="section-title">Status timeline</h2>
              <ol className="timeline">
                {[...(complaint.updates || [])].reverse().map((update, index) => (
                  <li key={`${update.updatedAt}-${index}`}>
                    <strong>{update.status}</strong>
                    <p>{update.message}</p>
                    <time dateTime={update.updatedAt}>{formatDateTime(update.updatedAt)}</time>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </article>

        <aside className="detail-aside stack" aria-label="Actions">
          <section className="card card-pad">
            <p className="kicker">Community support</p>
            <p className="support-count" style={{ marginTop: 10 }} aria-live="polite">{complaint.supporters?.length || 0}</p>
            <p className="help">{(complaint.supporters?.length || 0) === 1 ? 'neighbour supports' : 'neighbours support'} this issue</p>
            <button
              type="button"
              disabled={alreadySupported || ownComplaint}
              onClick={supportComplaint}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 18 }}
            >
              {alreadySupported ? <Check size={17} aria-hidden="true" /> : <Heart size={17} aria-hidden="true" />}
              {alreadySupported ? 'Supported' : ownComplaint ? 'Your complaint' : 'Support this issue'}
            </button>
            {message && <p className="notice" role="status" style={{ marginTop: 14 }}>{message}</p>}

            <div className="aside-links">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                    setMessage('Report link copied.')
                  } catch {
                    setMessage('Copy the link from your browser address bar.')
                  }
                }}
              >
                Copy report link <Copy size={16} aria-hidden="true" />
              </button>
              <Link to={`/map?issue=${complaint.id}`}>Locate on city map <MapPin size={16} aria-hidden="true" /></Link>
              {hasCoords && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${complaint.latitude}&mlon=${complaint.longitude}#map=17/${complaint.latitude}/${complaint.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on OpenStreetMap <ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </section>

          <section className="card card-pad">
            <h2 className="section-title">Resolution centre</h2>
            <p className="help" style={{ marginTop: 0 }}>Priority score</p>
            <p style={{ fontWeight: 700, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>{score}<span style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}> / 100</span></p>
            <div className="meter" role="presentation"><i style={{ width: `${score}%` }} /></div>
            {complaint.escalated ? <span className="flag flag--red">Escalation due</span> : complaint.overdue ? <span className="flag">Overdue</span> : null}
            {complaint.verified && <p className="notice notice--ok" style={{ marginTop: 14 }}>Citizen verified · {complaint.repairRating}/5</p>}

            {complaint.resolutionImage && (
              <div className="ba">
                {complaint.image && <figure><figcaption>Before</figcaption><img src={assetUrl(complaint.image)} alt="Before repair" /></figure>}
                <figure><figcaption>After</figcaption><img src={assetUrl(complaint.resolutionImage)} alt="After repair" /></figure>
              </div>
            )}

            {user && (user.role === 'admin' || (user.role === 'staff' && user.department === complaint.department)) && (
              <div className="field" style={{ marginTop: 18 }}>
                <label htmlFor="proof-upload" className="label">Upload repair proof</label>
                <input
                  id="proof-upload"
                  className="input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void proof(f)
                  }}
                />
              </div>
            )}

            {ownComplaint && complaint.status === 'Resolved' && (
              <div style={{ marginTop: 18 }}>
                <p className="label" id="verify-label">Is it fixed? Rate the repair</p>
                <div className="rating" role="group" aria-labelledby="verify-label">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" className="btn btn-outline btn-sm" key={n} onClick={() => void review('verify', n)} aria-label={`Verify repair, ${n} out of 5`}>
                      Verify {n}/5
                    </button>
                  ))}
                </div>
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', marginTop: 10 }} onClick={() => void review('reopen')}>
                  Reopen issue
                </button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  )
}
