import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Printer, Download, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { reportAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import type { MonthlyReport, PerformanceRating, ReportMonth } from '../../types'
import { formatDateTime } from '../../utils/helpers'
import { STAFF_DEPARTMENTS } from '../../utils/departments'
import { EmptyState, ErrorState, LineSkeleton } from '../../components/ui/States'

interface Loaded {
  report: MonthlyReport
  partial: boolean
  source: string
  generatedAt: string
  generatedBy: string
}

const dash = (value: number | null, suffix = '') => (value === null ? '—' : `${value}${suffix}`)

function ratingClass(rating: PerformanceRating) {
  if (rating === 'Good') return 'badge--resolved'
  if (rating === 'Needs attention') return 'badge--rejected'
  if (rating === 'Fair') return 'badge--pending'
  return 'badge--progress'
}

/** Change versus last month. `goodWhenUp` flips the colour for measures where lower is better. */
function Delta({ now, before, goodWhenUp = true, unit = '' }: { now: number | null; before: number | null | undefined; goodWhenUp?: boolean; unit?: string }) {
  if (now === null || before === null || before === undefined) return null
  const diff = Math.round((now - before) * 10) / 10
  if (diff === 0) return <span className="delta"><Minus size={14} aria-hidden="true" /> same as last month</span>
  const up = diff > 0
  const good = up === goodWhenUp
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span className={`delta ${good ? 'delta--good' : 'delta--bad'}`}>
      <Icon size={14} aria-hidden="true" /> {up ? '+' : ''}{diff}{unit} vs last month
    </span>
  )
}

function toCsv(report: MonthlyReport) {
  const q = (v: string | number | null) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const s = report.summary
  const lines: string[] = [
    [q('CivicBridge monthly report'), q(report.label), q(report.scope)].join(','),
    '',
    [q('Metric'), q('Value')].join(','),
    ...([
      ['Reports received', s.received],
      ['Reports resolved', s.resolved],
      ['Open at start of month', s.backlogIn],
      ['Open at end of month', s.openAtEnd],
      ['Resolution rate (%)', s.resolutionRate],
      ['Average resolution time (days)', s.avgResolutionDays],
      [`Resolved within ${report.targets.overdueDays} days (%)`, s.onTimeRate],
      ['Overdue open reports', s.overdueAtEnd],
      ['Escalation due', s.escalatedAtEnd],
      ['Reopened by citizens', s.reopened],
      ['Average repair rating (/5)', s.avgRepairRating],
    ] as [string, number | null][]).map(([k, v]) => [q(k), q(v)].join(',')),
    '',
    [q('Department'), q('Received'), q('Resolved'), q('Open at end'), q('Resolution rate %'), q('Avg days'), q('Overdue'), q('Rating')].join(','),
    ...report.departments.map((d) =>
      [q(d.department), q(d.received), q(d.resolved), q(d.openAtEnd), q(d.resolutionRate), q(d.avgResolutionDays), q(d.overdueAtEnd), q(d.rating)].join(',')),
    '',
    [q('Category'), q('Received'), q('Resolved'), q('Open at end'), q('Avg days')].join(','),
    ...report.categories.map((c) => [q(c.category), q(c.received), q(c.resolved), q(c.openAtEnd), q(c.avgResolutionDays)].join(',')),
  ]
  return lines.join('\n')
}

export default function MonthlyReports() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [months, setMonths] = useState<ReportMonth[]>([])
  const [month, setMonth] = useState('')
  const [department, setDepartment] = useState('ALL')
  const [data, setData] = useState<Loaded | null>(null)
  const [emptyMessage, setEmptyMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    reportAPI.listMonths()
      .then((res) => {
        const list: ReportMonth[] = res.data.months || []
        setMonths(list)
        if (list.length) setMonth((m) => m || list[0].month)
      })
      .catch(() => setError('Unable to load the list of reports.'))
  }, [attempt])

  useEffect(() => {
    if (!month) return
    setLoading(true)
    setError('')
    setEmptyMessage('')
    reportAPI.getMonth(month, isAdmin && department !== 'ALL' ? department : undefined)
      .then((res) => {
        if (res.data.empty) {
          setData(null)
          setEmptyMessage(res.data.message)
        } else {
          setData(res.data as Loaded)
        }
      })
      .catch((err: unknown) => {
        setData(null)
        setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Unable to build this report.' : 'Something went wrong.')
      })
      .finally(() => setLoading(false))
  }, [month, department, isAdmin, attempt])

  const currentMonth = months[0]?.month
  const report = data?.report
  const s = report?.summary
  const prev = report?.previous

  const kpis = useMemo(() => {
    if (!s || !report) return []
    return [
      { label: 'Reports received', value: String(s.received), delta: <Delta now={s.received} before={prev?.received} goodWhenUp={false} /> },
      { label: 'Resolved', value: String(s.resolved), delta: <Delta now={s.resolved} before={prev?.resolved} /> },
      { label: 'Resolution rate', value: dash(s.resolutionRate, '%'), delta: <Delta now={s.resolutionRate} before={prev?.resolutionRate} unit=" pts" /> },
      { label: 'Avg. days to resolve', value: dash(s.avgResolutionDays), delta: <Delta now={s.avgResolutionDays} before={prev?.avgResolutionDays} goodWhenUp={false} /> },
      { label: `Resolved within ${report.targets.overdueDays} days`, value: dash(s.onTimeRate, '%'), delta: <Delta now={s.onTimeRate} before={prev?.onTimeRate} unit=" pts" /> },
      { label: 'Open at month end', value: String(s.openAtEnd), delta: <Delta now={s.openAtEnd} before={prev?.openAtEnd} goodWhenUp={false} /> },
    ]
  }, [s, prev, report])

  async function regenerate() {
    setNotice('')
    try {
      const res = await reportAPI.regenerate(month)
      setNotice(res.data.message)
      setAttempt((a) => a + 1)
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Unable to regenerate.' : 'Something went wrong.')
    }
  }

  function downloadCsv() {
    if (!report) return
    const blob = new Blob([toCsv(report)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `civicbridge-report-${report.month}${report.scope === 'All departments' ? '' : '-' + report.scope.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const maxCategory = Math.max(1, ...(report?.categories.map((c) => c.received) ?? [1]))

  return (
    <DashboardLayout title="Monthly civic report">
      <div className="report-tools no-print">
        <div className="field">
          <label htmlFor="report-month" className="label">Month</label>
          <select id="report-month" className="select" value={month} onChange={(e) => setMonth(e.target.value)} disabled={!months.length}>
            {months.map((m) => <option key={m.month} value={m.month}>{m.label}{m.partial ? ' (month to date)' : ''}</option>)}
          </select>
        </div>

        {isAdmin && (
          <div className="field">
            <label htmlFor="report-dept" className="label">Department</label>
            <select id="report-dept" className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="ALL">All departments</option>
              {STAFF_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        <div className="report-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()} disabled={!report}>
            <Printer size={16} aria-hidden="true" /> Print / save PDF
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={downloadCsv} disabled={!report}>
            <Download size={16} aria-hidden="true" /> CSV
          </button>
          {isAdmin && month && month !== currentMonth && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => void regenerate()}>
              <RefreshCw size={16} aria-hidden="true" /> Regenerate
            </button>
          )}
        </div>
      </div>

      {notice && <p className="notice notice--ok no-print" role="status" style={{ marginBottom: 16 }}>{notice}</p>}

      {loading ? <LineSkeleton rows={4} /> :
        error ? <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} /> :
        emptyMessage ? <EmptyState title="Nothing to report" message={emptyMessage} /> :
        !report || !s ? null : (
          <article className="report" aria-label={`${report.label} report`}>
            <header className="report-head card card-pad">
              <div>
                <p className="eyebrow">{report.scope}</p>
                <h2>{report.label}</h2>
                <p className="meta-line">
                  {data?.partial
                    ? `Month to date — figures as of ${formatDateTime(report.asOf)}.`
                    : `Final report for ${formatDateTime(report.periodStart).split(',')[0]} to ${formatDateTime(report.periodEnd).split(',')[0]}.`}
                </p>
                <p className="meta-line">
                  {data?.source === 'live'
                    ? 'Calculated live from current complaint data.'
                    : data?.generatedBy === 'system'
                      ? `Generated automatically on ${formatDateTime(data.generatedAt)}.`
                      : `Regenerated on ${formatDateTime(data?.generatedAt ?? '')}.`}
                </p>
              </div>
              <span className={`badge ${ratingClass(s.rating)}`}><i aria-hidden="true" />{s.rating}</span>
            </header>

            <dl className="stat-row report-kpis">
              {kpis.map((k) => (
                <div key={k.label} className="card stat">
                  <dt style={{ marginTop: 0 }}>{k.label}</dt>
                  <dd>{k.value}</dd>
                  <div className="kpi-delta">{k.delta}</div>
                </div>
              ))}
            </dl>

            <section className="card card-pad" style={{ marginTop: 20 }} aria-labelledby="hl-title">
              <h3 id="hl-title" style={{ marginBottom: 10 }}>Highlights</h3>
              <ul className="highlights">
                {report.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </section>

            <section className="card card-pad" style={{ marginTop: 20 }} aria-labelledby="dept-title">
              <h3 id="dept-title" style={{ marginBottom: 10 }}>Department performance</h3>
              <div className="table-scroll">
                <table className="rtable">
                  <thead>
                    <tr>
                      <th scope="col">Department</th>
                      <th scope="col">Received</th>
                      <th scope="col">Resolved</th>
                      <th scope="col">Open</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Avg days</th>
                      <th scope="col">Overdue</th>
                      <th scope="col">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.departments.map((d) => (
                      <tr key={d.department}>
                        <th scope="row">{d.department}</th>
                        <td>{d.received}</td>
                        <td>{d.resolved}</td>
                        <td>{d.openAtEnd}</td>
                        <td>{dash(d.resolutionRate, '%')}</td>
                        <td>{dash(d.avgResolutionDays)}</td>
                        <td>{d.overdueAtEnd}</td>
                        <td><span className={`badge ${ratingClass(d.rating)}`}><i aria-hidden="true" />{d.rating}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="impact-cols">
              <section className="card card-pad" aria-labelledby="cat-title">
                <h3 id="cat-title" style={{ marginBottom: 12 }}>Reports by category</h3>
                <ul className="bars">
                  {report.categories.map((c) => (
                    <li key={c.category}>
                      <div className="bars-label"><span>{c.category}</span><span>{c.received} received · {c.resolved} resolved</span></div>
                      <div className="meter" role="presentation"><i style={{ width: `${(c.received / maxCategory) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card card-pad" aria-labelledby="svc-title">
                <h3 id="svc-title" style={{ marginBottom: 6 }}>Service quality</h3>
                <ServiceRow label="Open at start of month" value={String(s.backlogIn)} />
                <ServiceRow label="Overdue open reports" value={`${s.overdueAtEnd} (${report.targets.overdueDays}+ days)`} />
                <ServiceRow label="Escalation due" value={`${s.escalatedAtEnd} (${report.targets.escalationDays}+ days)`} />
                <ServiceRow label="Reopened by citizens" value={String(s.reopened)} />
                <ServiceRow label="Verified repairs" value={String(s.verifiedRepairs)} />
                <ServiceRow label="Average repair rating" value={s.avgRepairRating === null ? '—' : `${s.avgRepairRating} / 5`} />
              </section>
            </div>

            <p className="meta-line report-note">
              Resolution rate = reports resolved ÷ (reports open at the start of the month + reports received). Ratings are rule-based:
              Good at 70%+ with no escalations, Needs attention under 40% or with any escalation due, otherwise Fair. Months follow UTC.
            </p>
          </article>
        )}
    </DashboardLayout>
  )
}

function ServiceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="list-row">
      <strong style={{ fontWeight: 550 }}>{label}</strong>
      <span className="pts">{value}</span>
    </div>
  )
}
