import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Lock, Info } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { impactAPI } from '../../services/api'
import type { ImpactSummary, LeaderboardRow } from '../../types'
import CountUp from '../../components/ui/CountUp'
import BadgeIcon from '../../components/ui/BadgeIcon'
import { ErrorState, LineSkeleton } from '../../components/ui/States'

const R = 62
const C = 2 * Math.PI * R

export default function ImpactScore() {
  const [impact, setImpact] = useState<ImpactSummary | null>(null)
  const [board, setBoard] = useState<LeaderboardRow[]>([])
  const [you, setYou] = useState<LeaderboardRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([impactAPI.getMine(), impactAPI.getLeaderboard()])
      .then(([mine, lb]) => {
        setImpact(mine.data.impact)
        setBoard(lb.data.leaderboard || [])
        setYou(lb.data.you || null)
      })
      .catch(() => setError('Unable to load your impact score.'))
      .finally(() => setLoading(false))
  }, [attempt])

  // Animate the ring once data is on screen.
  useEffect(() => {
    if (loading || error) return
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [loading, error])

  return (
    <DashboardLayout title="Civic Impact Score">
      {loading ? <LineSkeleton rows={3} /> :
        error || !impact ? <ErrorState message={error || 'Unable to load your impact score.'} onRetry={() => setAttempt((a) => a + 1)} /> : (
          <>
            <section className="card card-pad impact-hero" aria-label="Your score">
              <div className="impact-ring">
                <svg viewBox="0 0 150 150" width="150" height="150" aria-hidden="true">
                  <circle className="track" cx="75" cy="75" r={R} />
                  <circle
                    className="arc"
                    cx="75" cy="75" r={R}
                    strokeDasharray={C}
                    strokeDashoffset={drawn ? C * (1 - impact.levelProgress / 100) : C}
                  />
                </svg>
                <div className="impact-ring-label">
                  <strong><CountUp value={impact.score} /></strong>
                  <small>points</small>
                </div>
              </div>

              <div className="impact-copy">
                <p className="eyebrow">Your level</p>
                <h2>{impact.level}</h2>
                {impact.nextLevel ? (
                  <p>
                    {impact.pointsToNext} more point{impact.pointsToNext === 1 ? '' : 's'} to reach <strong>{impact.nextLevel.name}</strong>.
                  </p>
                ) : (
                  <p>You’ve reached the highest level. Thank you for looking after your city.</p>
                )}
                <p className="meta-line">{impact.badgesEarned} of {impact.badges.length} badges earned</p>
              </div>
            </section>

            <section className="card card-pad" style={{ marginTop: 20 }} aria-labelledby="badges-title">
              <h2 id="badges-title" style={{ marginBottom: 16 }}>Achievement badges</h2>
              <ul className="badge-grid">
                {impact.badges.map((b) => (
                  <li key={b.id} className={`achv ${b.earned ? 'is-earned' : ''}`}>
                    <span className="achv-icon">
                      {b.earned ? <BadgeIcon name={b.icon} /> : <Lock size={20} aria-hidden="true" />}
                    </span>
                    <div>
                      <strong>{b.name}</strong>
                      <small>{b.description}</small>
                      {b.earned ? (
                        <span className="achv-state">Earned</span>
                      ) : (
                        <>
                          <div className="meter" role="presentation"><i style={{ width: `${(b.progress / b.target) * 100}%` }} /></div>
                          <span className="achv-state achv-state--locked">{b.progress} / {b.target}</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="impact-cols">
              <section className="card card-pad" aria-labelledby="how-title">
                <h2 id="how-title" style={{ marginBottom: 8 }}>Where your points come from</h2>
                <div>
                  {impact.breakdown.map((item) => (
                    <div key={item.key} className="list-row">
                      <div>
                        <strong>{item.label}</strong>
                        <small>{item.count} so far</small>
                      </div>
                      <span className="pts">+{item.points}</span>
                    </div>
                  ))}
                </div>
                <p className="meta-line" style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  <Info size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>Rejected reports earn no points. Support points are capped (20 supports given; 5 supporters counted per report) so the score rewards quality, not volume.</span>
                </p>
              </section>

              <section className="card card-pad" aria-labelledby="lb-title">
                <h2 id="lb-title" style={{ marginBottom: 8 }}>Community leaderboard</h2>
                {board.length === 0 ? (
                  <p className="meta-line">No scores yet. <Link to="/report" className="link-arrow">Submit a report</Link> to get on the board.</p>
                ) : (
                  <ol className="lb">
                    {board.map((row) => (
                      <li key={`${row.rank}-${row.name}`} className={row.isYou ? 'is-you' : ''}>
                        <span className="rank">{row.rank === 1 ? <Trophy size={16} aria-label="First place" /> : row.rank}</span>
                        <span className="who">
                          <strong>{row.name}{row.isYou && ' (you)'}</strong>
                          <small>{row.level}</small>
                        </span>
                        <span className="pts">{row.score}</span>
                      </li>
                    ))}
                    {you && (
                      <li className="is-you">
                        <span className="rank">{you.rank}</span>
                        <span className="who"><strong>{you.name} (you)</strong><small>{you.level}</small></span>
                        <span className="pts">{you.score}</span>
                      </li>
                    )}
                  </ol>
                )}
                <p className="meta-line" style={{ marginTop: 14 }}>Only first names and an initial are shown.</p>
              </section>
            </div>
          </>
        )}
    </DashboardLayout>
  )
}
