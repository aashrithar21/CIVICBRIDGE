import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, CheckCircle, ClipboardList, Camera, Users, Clock } from 'lucide-react'
import { complaintAPI } from '../services/api'
import type { Complaint } from '../types'
import { assetUrl, byNewest } from '../utils/helpers'
import HeroMap from '../components/home/HeroMap'
import Reveal from '../components/ui/Reveal'
import CountUp from '../components/ui/CountUp'
import StatusBadge from '../components/ui/StatusBadge'
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui/States'

export default function Home() {
  const [items, setItems] = useState<Complaint[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    complaintAPI
      .getAll()
      .then((r) => {
        if (!active) return
        setItems(r.data.complaints || [])
        setStatus('ready')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [attempt])

  const newest = useMemo(() => [...items].sort(byNewest), [items])
  const resolved = items.filter((i) => i.status === 'Resolved').length
  const active = items.filter((i) => !['Resolved', 'Rejected'].includes(i.status)).length
  const rate = items.length ? Math.round((resolved / items.length) * 100) : 0
  const ready = status === 'ready'

  const metrics = [
    { label: 'Reported issues', value: items.length, suffix: '' },
    { label: 'Resolved', value: resolved, suffix: '' },
    { label: 'Active issues', value: active, suffix: '' },
    { label: 'Resolution rate', value: rate, suffix: '%' },
  ]

  return (
    <main className="page container" style={{ paddingTop: 0 }}>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">The civic network</p>
          <h1 id="hero-title">
            Better streets. <em>Stronger communities.</em>
          </h1>
          <p className="hero-lede">A direct connection between your neighbourhood and the people who can make it better.</p>
          <div className="hero-actions">
            <Link to="/report" className="btn btn-primary">
              Report an issue <ArrowRight size={18} aria-hidden="true" className="arrow" />
            </Link>
            <Link to="/explore" className="btn btn-outline">Explore reports</Link>
          </div>
          <p className="hero-note">
            <i aria-hidden="true" />
            {ready ? `${active} issue${active === 1 ? '' : 's'} being worked on right now` : 'Every report is public and tracked'}
          </p>
        </div>

        <HeroMap items={items} loading={status === 'loading'} latest={newest[0]} />
      </section>

      <section aria-label="Community statistics">
        <dl className="metrics">
          {metrics.map((m) => (
            <div className="metric" key={m.label}>
              <dt>{m.label}</dt>
              <dd>{ready ? <CountUp value={m.value} suffix={m.suffix} /> : '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section" aria-labelledby="how-title">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 id="how-title">From a pothole to a fix, in plain sight.</h2>
            </div>
          </div>
        </Reveal>

        <div className="bento">
          <Reveal className="b-wide">
            <article className="tile tile--ink" style={{ height: '100%' }}>
              <svg className="tile-art" viewBox="0 0 320 200" aria-hidden="true">
                <g fill="none" stroke="#7fd8c3" strokeOpacity=".35" strokeWidth="1.5">
                  <path d="M0 60H320M0 120H320M70 0V200M170 0V200M250 0V200" />
                  <circle cx="170" cy="120" r="46" strokeOpacity=".2" />
                  <circle cx="170" cy="120" r="82" strokeOpacity=".12" />
                </g>
                <circle cx="170" cy="120" r="9" fill="#7fd8c3" />
                <circle cx="70" cy="60" r="6" fill="#f2a93b" />
                <circle cx="250" cy="60" r="6" fill="#6aa0ff" />
              </svg>
              <span className="tile-icon"><MapPin size={22} aria-hidden="true" /></span>
              <div>
                <p className="step-no" style={{ color: '#8fa9bf' }}>01 · Report</p>
                <h3 style={{ marginTop: 8, maxWidth: '16ch' }}>Pin the exact spot, add a photo.</h3>
                <p>Use GPS or tap the map to place your report precisely, so the right crew can find it the first time.</p>
              </div>
            </article>
          </Reveal>

          <Reveal className="b-narrow" delay={80}>
            <article className="tile tile--mint" style={{ height: '100%' }}>
              <span className="tile-icon"><ClipboardList size={22} aria-hidden="true" /></span>
              <div>
                <p className="step-no">02 · Route</p>
                <h3 style={{ marginTop: 8 }}>Sent to the right department.</h3>
                <p>Reports are assigned by category and prioritised by support and age.</p>
              </div>
            </article>
          </Reveal>

          <Reveal className="b-narrow" delay={160}>
            <article className="tile tile--sand" style={{ height: '100%' }}>
              <span className="tile-icon"><CheckCircle size={22} aria-hidden="true" /></span>
              <div>
                <p className="step-no">03 · Resolve</p>
                <h3 style={{ marginTop: 8 }}>You confirm it’s fixed.</h3>
                <p>Verify the repair and rate it, or reopen the issue if it isn’t.</p>
              </div>
            </article>
          </Reveal>

          <Reveal className="b-half" delay={60}>
            <Link to="/map" className="tile" style={{ height: '100%' }}>
              <span className="tile-icon"><MapPin size={22} aria-hidden="true" /></span>
              <div>
                <h3>See the bigger picture.</h3>
                <p>Find individual reports and issue concentrations on the city map.</p>
              </div>
              <span className="link-arrow">Open the map <ArrowRight size={16} aria-hidden="true" className="arrow" /></span>
            </Link>
          </Reveal>

          <Reveal className="b-half" delay={140}>
            <Link to="/transparency" className="tile" style={{ height: '100%' }}>
              <span className="tile-icon"><Clock size={22} aria-hidden="true" /></span>
              <div>
                <h3>Progress, in public.</h3>
                <p>Explore resolution rates and department performance.</p>
              </div>
              <span className="link-arrow">View transparency <ArrowRight size={16} aria-hidden="true" className="arrow" /></span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="recent-title">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="eyebrow">Around your city</p>
              <h2 id="recent-title">Recent reports</h2>
            </div>
            <Link to="/explore" className="link-arrow">View all reports <ArrowRight size={16} aria-hidden="true" className="arrow" /></Link>
          </div>
        </Reveal>

        {status === 'loading' && <CardSkeletons count={3} />}
        {status === 'error' && (
          <ErrorState
            message="Unable to connect to the server."
            onRetry={() => {
              setStatus('loading')
              setAttempt((a) => a + 1)
            }}
          />
        )}
        {ready && newest.length === 0 && (
          <EmptyState title="No reports yet" message="Be the first to put an issue on the map.">
            <Link to="/report" className="btn btn-primary btn-sm">Report an issue</Link>
          </EmptyState>
        )}
        {ready && newest.length > 0 && (
          <div className="issue-grid">
            {newest.slice(0, 3).map((i, n) => (
              <Reveal key={i.id} delay={n * 90}>
                <article className="issue-card" style={{ height: '100%' }}>
                  <div className="issue-media">
                    {i.image ? (
                      <img loading="lazy" decoding="async" src={assetUrl(i.image)} alt="" />
                    ) : (
                      <div className="no-photo"><Camera size={26} aria-hidden="true" /><span>No photograph</span></div>
                    )}
                    <span className="cat-tag">{i.category}</span>
                  </div>
                  <div className="issue-body">
                    <div className="row"><StatusBadge status={i.status} /></div>
                    <h3><Link to={`/issues/${i.id}`}>{i.title}</Link></h3>
                    <p className="meta"><MapPin size={14} aria-hidden="true" />{i.address}</p>
                    <div className="issue-foot" style={{ pointerEvents: 'none' }}>
                      <span className="link-arrow">View report <ArrowRight size={15} aria-hidden="true" className="arrow" /></span>
                      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <Users size={14} aria-hidden="true" />{i.supporters?.length || 0}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
