import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { complaintAPI } from '../services/api'
import type { Complaint } from '../types'
import LiveMap from '../components/common/LiveMap'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import { ErrorState, LineSkeleton } from '../components/ui/States'

export default function CityMap() {
  const [heat, setHeat] = useState(false)
  const [params] = useSearchParams()
  const [items, setItems] = useState<Complaint[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(params.get('issue') || '')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          `${i.title} ${i.address} ${i.category}`.toLowerCase().includes(search.toLowerCase()) &&
          (!status || (status === 'Ongoing' ? !['Resolved', 'In Progress', 'Rejected'].includes(i.status) : i.status === status)),
      ),
    [items, search, status],
  )
  const mapped = useMemo(() => filtered.filter((i) => i.latitude != null && i.longitude != null), [filtered])
  const current = filtered.find((i) => i.id === selected)

  return (
    <main className="page container">
      <PageHeader
        eyebrow="Live city view"
        title="Every issue, on the map."
        lede="Explore reported locations and select a pin to see its details."
      />

      <div className="card toolbar" style={{ gridTemplateColumns: undefined }}>
        <div style={{ display: 'grid', gap: 12 }} className="map-toolbar">
          <div className="input-wrap">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search reports"
              placeholder="Search neighbourhood or issue"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelected('')
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select
              aria-label="Filter status"
              className="select"
              style={{ flex: '1 1 180px' }}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setSelected('')
              }}
            >
              <option value="">All statuses</option>
              <option>Ongoing</option>
              <option>In Progress</option>
              <option value="Resolved">Completed</option>
            </select>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSelected('')
                setSearch('')
                setStatus('')
              }}
            >
              Show all pins
            </button>
          </div>
        </div>
      </div>

      <p className="result-bar" role="status" aria-live="polite">
        {loading ? 'Loading reports…' : error ? '' : `${mapped.length} mapped · ${filtered.length - mapped.length} without coordinates`}
      </p>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="map-layout">
          <aside aria-label="Reports list">
            {loading ? (
              <LineSkeleton rows={5} />
            ) : filtered.length === 0 ? (
              <div className="state state--empty"><div><strong>No reports match</strong><p>Try clearing the search or filter.</p></div></div>
            ) : (
              <div className="map-list">
                {filtered.map((i) => (
                  <button
                    type="button"
                    key={i.id}
                    className={`map-row ${i.id === selected ? 'is-selected' : ''}`}
                    aria-pressed={i.id === selected}
                    onClick={() => setSelected(i.id)}
                  >
                    <strong>{i.title}</strong>
                    <small>{i.address}</small>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <StatusBadge status={i.status} />
                      {(i.latitude == null || i.longitude == null) && <small>No coordinates</small>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section className="card" style={{ overflow: 'hidden' }} aria-label="Map">
            <div className="map-panel-bar">
              <button type="button" className="btn btn-outline btn-sm" aria-pressed={heat} onClick={() => setHeat(!heat)}>
                {heat ? 'Hide' : 'Show'} issue density
              </button>
              <div className="map-legend" style={{ padding: 0, border: 0 }}>
                <span><i style={{ background: '#d97706' }} />Ongoing</span>
                <span><i style={{ background: '#2563eb' }} />In progress</span>
                <span><i style={{ background: '#059669' }} />Completed</span>
              </div>
            </div>
            <LiveMap heat={heat} items={mapped} selected={current?.id} onSelect={setSelected} />
            {current && (
              <div className="map-selected">
                <div>
                  <strong>{current.title}</strong>
                  <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>{current.address}</p>
                </div>
                <Link className="btn btn-primary btn-sm" to={`/issues/${current.id}`}>Open report</Link>
              </div>
            )}
          </section>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
        Demo coordinates are illustrative. Map tiles require an internet connection.
      </p>
    </main>
  )
}
