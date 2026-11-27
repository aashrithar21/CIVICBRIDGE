import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Complaint } from '../../types'
import StatusBadge from '../ui/StatusBadge'
import { statusTone } from '../../utils/helpers'

const W = 500
const H = 440
const COLORS = { pending: '#f2a93b', progress: '#6aa0ff', resolved: '#4fd6a0', rejected: '#9aa9b8' }

/** Projects real report coordinates into the preview so the pins reflect actual data. */
function project(items: Complaint[]) {
  const pts = items.filter((i) => i.latitude != null && i.longitude != null).slice(0, 14)
  if (!pts.length) return []
  const lats = pts.map((p) => p.latitude as number)
  const lons = pts.map((p) => p.longitude as number)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const spanLat = Math.max(maxLat - minLat, 0.004)
  const spanLon = Math.max(maxLon - minLon, 0.004)
  const x0 = 70, x1 = W - 70, y0 = 80, y1 = 270
  return pts.map((p) => ({
    id: p.id,
    status: p.status,
    x: x0 + (((p.longitude as number) - minLon) / spanLon) * (x1 - x0),
    y: y1 - (((p.latitude as number) - minLat) / spanLat) * (y1 - y0),
  }))
}

export default function HeroMap({ items, loading, latest }: { items: Complaint[]; loading: boolean; latest?: Complaint }) {
  const pins = project(items)

  return (
    <div className="hero-map">
      <svg className="map-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Map preview showing ${pins.length} reported issues`}>
        <rect width={W} height={H} fill="#10283f" />
        <g fill="#15324d">
          <rect x="24" y="60" width="110" height="70" rx="8" />
          <rect x="154" y="60" width="90" height="70" rx="8" />
          <rect x="264" y="60" width="120" height="70" rx="8" />
          <rect x="404" y="60" width="80" height="70" rx="8" />
          <rect x="24" y="150" width="70" height="90" rx="8" />
          <rect x="114" y="150" width="130" height="90" rx="8" />
          <rect x="264" y="150" width="80" height="90" rx="8" />
          <rect x="364" y="150" width="120" height="90" rx="8" />
          <rect x="24" y="260" width="130" height="80" rx="8" />
          <rect x="174" y="260" width="70" height="80" rx="8" />
          <rect x="264" y="260" width="120" height="80" rx="8" />
          <rect x="404" y="260" width="80" height="80" rx="8" />
        </g>
        <ellipse cx="210" cy="195" rx="46" ry="30" fill="#14473f" opacity=".9" />
        <path d="M-10 330 C 90 290, 160 380, 260 340 S 430 300, 520 350" fill="none" stroke="#1d4a6b" strokeWidth="26" strokeLinecap="round" opacity=".55" />
        <path d="M-10 40 L 520 250" fill="none" stroke="#2a7a80" strokeWidth="7" strokeLinecap="round" opacity=".7" />
        <g stroke="#26486a" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M0 140H500M0 250H500M0 355H500M144 0V440M254 0V440M394 0V440M104 140V440" />
        </g>

        {pins.map((p, i) => {
          const color = COLORS[statusTone(p.status)]
          return (
            <g key={p.id} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              {statusTone(p.status) !== 'resolved' && (
                <circle className="pin-ring" r="9" fill={color} opacity=".5" style={{ animationDelay: `${(i % 6) * 0.45}s` }} />
              )}
              <circle r="7" fill={color} stroke="#10283f" strokeWidth="3" />
            </g>
          )
        })}
      </svg>

      <div className="legend" aria-hidden="true">
        <span><i style={{ background: COLORS.pending }} />Ongoing</span>
        <span><i style={{ background: COLORS.progress }} />In progress</span>
        <span><i style={{ background: COLORS.resolved }} />Resolved</span>
      </div>

      {loading ? (
        <div className="hero-card" aria-hidden="true">
          <div className="skeleton" style={{ height: 14, width: '40%' }} />
          <div className="skeleton" style={{ height: 18, width: '85%', marginTop: 12 }} />
          <div className="skeleton" style={{ height: 14, width: '60%', marginTop: 10 }} />
        </div>
      ) : latest ? (
        <Link to={`/issues/${latest.id}`} className="hero-card">
          <div className="row">
            <span className="kicker">Latest report</span>
            <StatusBadge status={latest.status} />
          </div>
          <h3>{latest.title}</h3>
          <p><MapPin size={14} aria-hidden="true" />{latest.address}</p>
        </Link>
      ) : null}
    </div>
  )
}
