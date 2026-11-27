import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

/** Placeholder cards shown while report lists load. */
export function CardSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="issue-grid" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading reports…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="issue-card" aria-hidden="true">
          <div className="skeleton" style={{ height: 176 }} />
          <div className="issue-body">
            <div className="skeleton" style={{ height: 18, width: '40%' }} />
            <div className="skeleton" style={{ height: 22, width: '85%' }} />
            <div className="skeleton" style={{ height: 14, width: '100%' }} />
            <div className="skeleton" style={{ height: 14, width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LineSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="stack">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton" aria-hidden="true" style={{ height: 64 }} />
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state--error" role="alert">
      <div>
        <strong>{message}</strong>
        <p>Check that the CivicBridge server is running, then try again.</p>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, message, children }: { title: string; message?: string; children?: ReactNode }) {
  return (
    <div className="state state--empty">
      <div>
        <strong>{title}</strong>
        {message && <p>{message}</p>}
      </div>
      {children}
    </div>
  )
}
