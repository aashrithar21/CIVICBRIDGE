import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { complaintAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import type { Complaint } from '../../types'
import { assetUrl } from '../../utils/helpers'
import StatusBadge from '../../components/ui/StatusBadge'
import CountUp from '../../components/ui/CountUp'
import { EmptyState, LineSkeleton } from '../../components/ui/States'

const statuses = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
]

export default function StaffDashboard({ admin = false }: { admin?: boolean }) {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadComplaints() {
    try {
      const response = await complaintAPI.getAll()
      const all: Complaint[] = response.data.complaints || []
      // Staff work on their own department's queue; admins see the whole city.
      setComplaints(admin ? all : all.filter((item) => item.department === user?.department))
    } catch {
      setError('Unable to load complaints. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.department, admin])

  async function changeStatus(id: string, status: string) {
    setMessage('')
    setError('')
    try {
      await complaintAPI.updateStatus(id, status, `Status updated to ${status}`)
      setComplaints((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
      )
      setMessage('Complaint status updated successfully.')
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Unable to update status.'
          : 'Something went wrong.',
      )
    }
  }

  const resolved = complaints.filter((c) => c.status === 'Resolved').length
  const active = complaints.filter((c) => !['Resolved', 'Rejected'].includes(c.status)).length

  return (
    <DashboardLayout title={admin ? 'Administration dashboard' : `${user?.department ?? 'Staff'} dashboard`}>
      <dl className="stat-row">
        {[
          ['Total complaints', complaints.length],
          ['Active complaints', active],
          ['Resolved complaints', resolved],
        ].map(([label, value]) => (
          <div key={String(label)} className="card stat">
            <dt style={{ marginTop: 0 }}>{label}</dt>
            <dd>{loading ? '—' : <CountUp value={Number(value)} />}</dd>
          </div>
        ))}
      </dl>

      <section className="card card-pad" style={{ marginTop: 20 }} aria-labelledby="mgmt-title">
        <h2 id="mgmt-title" style={{ marginBottom: 16 }}>Complaint management</h2>

        <div aria-live="polite">
          {message && <p className="notice notice--ok" role="status" style={{ marginBottom: 16 }}>{message}</p>}
          {error && <p className="alert" role="alert" style={{ marginBottom: 16 }}>{error}</p>}
        </div>

        {loading ? <LineSkeleton rows={3} /> :
          complaints.length === 0 ? (
            <EmptyState title={admin ? 'No complaints have been reported' : 'No complaints for your department'} message="New reports will appear here as citizens submit them." />
          ) : (
            <div className="stack">
              {complaints.map((item) => (
                <article key={item.id} className={`mgmt ${item.image ? 'has-img' : ''}`}>
                  {item.image && (
                    <img src={assetUrl(item.image)} alt="Complaint evidence" loading="lazy" decoding="async" />
                  )}
                  <div>
                    <div className="head">
                      <div>
                        <h3>{item.title}</h3>
                        <p className="meta-line">{item.category} · {item.department}</p>
                        <p className="meta-line">Reported by {item.citizenName}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="desc">{item.description}</p>
                    <p className="meta-line" style={{ marginTop: 8 }}>{item.address}</p>

                    <div className="update">
                      <label htmlFor={`status-${item.id}`}>Update status</label>
                      <select
                        id={`status-${item.id}`}
                        value={item.status}
                        onChange={(e) => changeStatus(item.id, e.target.value)}
                        className="select"
                      >
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </DashboardLayout>
  )
}
