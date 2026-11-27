import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Camera, Users, ArrowRight } from 'lucide-react'
import { complaintAPI } from '../services/api'
import type { Complaint } from '../types'
import { assetUrl } from '../utils/helpers'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import Reveal from '../components/ui/Reveal'
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui/States'

const categories = ['Road Damage', 'Garbage', 'Water Leakage', 'Streetlight', 'Drainage', 'Other']
const quick = [
  ['', 'All reports'],
  ['Ongoing', 'Ongoing'],
  ['In Progress', 'In progress'],
  ['Resolved', 'Completed'],
]

export default function ExploreIssues() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('recent')
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem('civicbridge_saved') || '[]')
      return Array.isArray(v) ? v.filter((x: unknown) => typeof x === 'string') : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id]
    setSaved(next)
    try {
      localStorage.setItem('civicbridge_saved', JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    complaintAPI
      .getAll()
      .then((res) => setComplaints(res.data.complaints || []))
      .catch(() => setError('Unable to load community reports.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return complaints
      .filter((item) => {
        const matchesSearch = `${item.title} ${item.description} ${item.address} ${item.category}`.toLowerCase().includes(term)
        const matchesStatus =
          !status || (status === 'Ongoing' ? ['Submitted', 'Under Review', 'Assigned'].includes(item.status) : item.status === status)
        return matchesSearch && matchesStatus && (!category || item.category === category) && (!savedOnly || saved.includes(item.id))
      })
      .sort((a, b) =>
        sort === 'popular'
          ? (b.supporters?.length || 0) - (a.supporters?.length || 0)
          : sort === 'oldest'
            ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
            : Date.parse(b.createdAt) - Date.parse(a.createdAt),
      )
  }, [complaints, search, status, category, sort, savedOnly, saved])

  const filtersActive = Boolean(search || status || category || savedOnly || sort !== 'recent')
  const reset = () => {
    setSearch('')
    setStatus('')
    setCategory('')
    setSort('recent')
    setSavedOnly(false)
  }

  return (
    <main className="page container">
      <PageHeader
        eyebrow="Community reports"
        title="Explore civic issues"
        lede="Discover problems reported in your community, see who is working on them, and add your support."
      />

      <div className="chip-row" role="group" aria-label="Quick status filter">
        {quick.map(([value, label]) => (
          <button key={label} type="button" className="chip" aria-pressed={status === value} onClick={() => setStatus(value)}>
            {label}
          </button>
        ))}
      </div>

      <div className="card toolbar">
        <div className="input-wrap">
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search reports"
            placeholder="Search by issue, category or location"
          />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="select">
          <option value="">All statuses</option>
          <option>Ongoing</option>
          <option>Submitted</option>
          <option>Under Review</option>
          <option>Assigned</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Rejected</option>
        </select>
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="select">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select aria-label="Sort reports" value={sort} onChange={(e) => setSort(e.target.value)} className="select">
          <option value="recent">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="popular">Most supported</option>
        </select>
      </div>

      <div className="result-bar">
        <span role="status" aria-live="polite">
          {loading ? 'Loading…' : error ? '' : `${filtered.length} report${filtered.length === 1 ? '' : 's'}`}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <label className="check">
            <input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
            Saved only ({saved.length})
          </label>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset} disabled={!filtersActive}>Reset filters</button>
        </span>
      </div>

      {loading ? (
        <CardSkeletons count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching issues found"
          message={savedOnly && !saved.length ? 'You haven’t saved any reports yet — use the star on a card to keep it here.' : 'Try another search or loosen your filters.'}
        >
          <button type="button" className="btn btn-outline btn-sm" onClick={reset}>Reset filters</button>
        </EmptyState>
      ) : (
        <div className="issue-grid">
          {filtered.map((item, n) => (
            <Reveal key={item.id} delay={Math.min(n, 5) * 60}>
              <article className="issue-card" style={{ height: '100%' }}>
                <div className="issue-media">
                  {item.image ? (
                    <img loading="lazy" decoding="async" src={assetUrl(item.image)} alt="" />
                  ) : (
                    <div className="no-photo"><Camera size={26} aria-hidden="true" /><span>No photograph</span></div>
                  )}
                  <span className="cat-tag">{item.category}</span>
                  <button
                    type="button"
                    className="save-btn"
                    aria-pressed={saved.includes(item.id)}
                    aria-label={`${saved.includes(item.id) ? 'Remove from saved' : 'Save report'}: ${item.title}`}
                    onClick={() => toggleSaved(item.id)}
                  >
                    <Star size={19} aria-hidden="true" />
                  </button>
                </div>
                <div className="issue-body">
                  <div className="row"><StatusBadge status={item.status} /></div>
                  <h2><Link to={`/issues/${item.id}`}>{item.title}</Link></h2>
                  <p className="desc">{item.description}</p>
                  <p className="meta"><MapPin size={14} aria-hidden="true" />{item.address}</p>
                  <div className="issue-foot">
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Users size={14} aria-hidden="true" />
                      {item.supporters?.length || 0} supporter{(item.supporters?.length || 0) === 1 ? '' : 's'}
                    </span>
                    <span style={{ display: 'inline-flex', gap: 16 }}>
                      <Link to={`/map?issue=${item.id}`}>Map</Link>
                      <Link to={`/issues/${item.id}`} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                        Details <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  )
}
