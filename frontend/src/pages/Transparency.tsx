import { useCallback, useEffect, useState } from 'react'
import { complaintAPI } from '../services/api'
import type { Complaint } from '../types'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import CountUp from '../components/ui/CountUp'
import { ErrorState, LineSkeleton } from '../components/ui/States'

const statuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected']
const R = 74
const C = 2 * Math.PI * R

export default function Transparency() {
  const [items, setItems] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawn, setDrawn] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    complaintAPI
      .getAll()
      .then((r) => setItems(r.data.complaints || []))
      .catch(() => setError('Unable to load reports.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Start bars/donut empty, then animate to their values once data is on screen.
  useEffect(() => {
    if (loading || error) return
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [loading, error])

  const total = items.length
  const resolved = items.filter((i) => i.status === 'Resolved').length
  const rate = total ? Math.round((resolved / total) * 100) : 0
  const active = items.filter((i) => !['Resolved', 'Rejected'].includes(i.status)).length
  const overdue = items.filter((i) => i.overdue).length
  const escalated = items.filter((i) => i.escalated).length
  const departments = Array.from(new Set(items.map((i) => i.department)))

  return (
    <main className="page container">
      <PageHeader
        eyebrow="Public accountability"
        title="Transparency dashboard"
        lede="Live community report statistics, computed from the reports stored in CivicBridge."
      />

      {loading ? (
        <LineSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="t-grid">
            <Reveal className="t-hero-wrap">
              <section className="t-hero" aria-label="Resolution rate" style={{ height: '100%' }}>
                <div>
                  <p className="kicker">Resolution rate</p>
                  <p style={{ marginTop: 10, color: '#b9c7d4', fontSize: 15, maxWidth: '30ch' }}>
                    {resolved} of {total} reports have been resolved.
                  </p>
                </div>
                <div className="donut">
                  <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden="true">
                    <circle className="track" cx="90" cy="90" r={R} />
                    <circle className="arc" cx="90" cy="90" r={R} strokeDasharray={C} strokeDashoffset={drawn ? C * (1 - rate / 100) : C} />
                  </svg>
                  <div className="donut-label">
                    <span><CountUp value={rate} suffix="%" /></span>
                    <small>resolved</small>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal className="t-stat-wrap" delay={80}>
              <dl className="t-stat" aria-label="Report totals">
                {[
                  ['Total reports', total, false],
                  ['Active', active, false],
                  ['Resolved', resolved, false],
                  ['Overdue (7+ days)', overdue, overdue > 0],
                  ['Escalation due (14+ days)', escalated, escalated > 0],
                  ['Departments', departments.length, false],
                ].map(([label, value, warn]) => (
                  <div key={String(label)}>
                    <dt>{label}</dt>
                    <dd className={warn ? 'warn' : ''}>{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="t-cols">
            <Reveal>
              <section className="card card-pad" style={{ height: '100%' }}>
                <h2>Reports by status</h2>
                <div style={{ marginTop: 22 }}>
                  {statuses.map((s) => {
                    const n = items.filter((i) => i.status === s).length
                    return (
                      <div key={s} className="bar-row">
                        <div className="bar-label"><span>{s}</span><span>{n}</span></div>
                        <div className="bar" role="presentation">
                          <i style={{ width: drawn && total ? `${(n / total) * 100}%` : 0 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </Reveal>

            <Reveal delay={100}>
              <section className="card card-pad" style={{ height: '100%' }}>
                <h2>Department performance</h2>
                <div style={{ marginTop: 22 }}>
                  {departments.length === 0 && <p style={{ color: 'var(--muted)' }}>No reports yet.</p>}
                  {departments.map((d) => {
                    const reports = items.filter((i) => i.department === d)
                    const done = reports.filter((i) => i.status === 'Resolved').length
                    return (
                      <div key={d} className="bar-row">
                        <div className="bar-label"><span>{d}</span><span>{done}/{reports.length} resolved</span></div>
                        <div className="bar" role="presentation">
                          <i className="is-green" style={{ width: drawn ? `${(done / reports.length) * 100}%` : 0 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </Reveal>
          </div>
        </>
      )}
    </main>
  )
}
