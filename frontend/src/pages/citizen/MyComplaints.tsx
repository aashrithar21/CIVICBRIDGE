import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { complaintAPI } from '../../services/api'
import type { Complaint } from '../../types'
import { formatDate } from '../../utils/helpers'
import StatusBadge from '../../components/ui/StatusBadge'
import { EmptyState, ErrorState, LineSkeleton } from '../../components/ui/States'

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError('')
    complaintAPI.getMine()
      .then((res) => setComplaints(res.data.complaints || []))
      .catch((err: unknown) => setError(
        axios.isAxiosError(err) ? err.response?.data?.message || 'Unable to load complaints.' : 'Something went wrong.',
      ))
      .finally(() => setLoading(false))
  }, [attempt])

  return (
    <DashboardLayout title="My complaints">
      <section className="card card-pad" aria-labelledby="my-reports">
        <h2 id="my-reports" style={{ marginBottom: 20 }}>Your submitted reports</h2>

        {loading ? <LineSkeleton rows={3} /> :
          error ? <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} /> :
          complaints.length === 0 ? (
            <EmptyState title="No complaints submitted yet" message="Reports you file will appear here with live status updates.">
              <Link to="/report" className="btn btn-primary btn-sm">Report an issue</Link>
            </EmptyState>
          ) : (
            <div className="stack">
              {complaints.map((item) => (
                <Link key={item.id} to={`/issues/${item.id}`} className="mgmt" style={{ display: 'block', transition: 'border-color .18s, box-shadow .18s' }}>
                  <div className="head">
                    <div>
                      <h3>{item.title}</h3>
                      <p className="meta-line">{item.category} · {item.department}</p>
                      <p className="meta-line" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.complaintNumber} · {formatDate(item.createdAt)}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                </Link>
              ))}
            </div>
          )}
      </section>
    </DashboardLayout>
  )
}
