import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilePlus2, ClipboardList, Clock, CheckCircle2, ArrowRight, Trophy } from 'lucide-react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { complaintAPI, impactAPI } from '../../services/api'
import type { Complaint, ImpactSummary } from '../../types'
import { formatDate } from '../../utils/helpers'
import StatusBadge from '../../components/ui/StatusBadge'
import CountUp from '../../components/ui/CountUp'
import { EmptyState, ErrorState, LineSkeleton } from '../../components/ui/States'

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [impact, setImpact] = useState<ImpactSummary | null>(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    complaintAPI.getMine()
      .then((res) => setComplaints(res.data.complaints || []))
      .catch((err: unknown) => {
        setError(axios.isAxiosError(err) ? 'Unable to load your complaints.' : 'Something went wrong.')
      })
      .finally(() => setLoading(false))
  }, [attempt])

  // The impact card is a bonus; the dashboard still works if it fails to load.
  useEffect(() => {
    impactAPI.getMine().then((res) => setImpact(res.data.impact)).catch(() => setImpact(null))
  }, [attempt])

  const resolved = complaints.filter((c) => c.status === 'Resolved').length
  const active = complaints.filter((c) => !['Resolved', 'Rejected'].includes(c.status)).length

  const stats = [
    { label: 'Total reports', value: complaints.length, icon: ClipboardList },
    { label: 'In progress', value: active, icon: Clock },
    { label: 'Resolved', value: resolved, icon: CheckCircle2 },
  ]

  return (
    <DashboardLayout title="Citizen dashboard">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <p style={{ color: 'var(--muted)' }}>Your community activity at a glance.</p>
        <Link to="/report" className="btn btn-primary btn-sm">
          <FilePlus2 size={16} aria-hidden="true" /> Report an issue
        </Link>
      </div>

      <dl className="stat-row">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card stat">
            <Icon size={22} aria-hidden="true" />
            <dt>{label}</dt>
            <dd>{loading ? '—' : <CountUp value={value} />}</dd>
          </div>
        ))}
      </dl>

      {impact && (
        <Link to="/citizen/impact" className="card impact-mini" style={{ marginTop: 20 }}>
          <span className="achv-icon is-gold"><Trophy size={22} aria-hidden="true" /></span>
          <span className="impact-mini-copy">
            <strong>Civic Impact Score: {impact.score}</strong>
            <small>
              {impact.level} · {impact.badgesEarned} badge{impact.badgesEarned === 1 ? '' : 's'}
              {impact.nextLevel ? ` · ${impact.pointsToNext} to ${impact.nextLevel.name}` : ''}
            </small>
            <span className="meter" role="presentation"><i style={{ width: `${impact.levelProgress}%` }} /></span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}

      <section className="card card-pad" style={{ marginTop: 20 }} aria-labelledby="recent-complaints">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <h2 id="recent-complaints">Recent complaints</h2>
          <Link to="/citizen/complaints" className="link-arrow">View all <ArrowRight size={15} aria-hidden="true" className="arrow" /></Link>
        </div>

        {loading ? <LineSkeleton rows={3} /> :
          error ? <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} /> :
          complaints.length === 0 ? (
            <EmptyState title="You haven’t submitted any complaints yet" message="Spotted a problem on your street? It only takes a few steps.">
              <Link to="/report" className="btn btn-primary btn-sm">Submit your first report</Link>
            </EmptyState>
          ) : (
            <div>
              {complaints.slice(0, 5).map((item) => (
                <Link key={item.id} to={`/issues/${item.id}`} className="list-row">
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.category} · {formatDate(item.createdAt)}</small>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              ))}
            </div>
          )}
      </section>
    </DashboardLayout>
  )
}
