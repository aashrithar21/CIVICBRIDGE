import { Link } from 'react-router-dom'
import { Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">
            Civic<em>Bridge</em>
          </p>
          <p style={{ marginTop: 20, maxWidth: '40ch', lineHeight: 1.65 }}>
            Connecting citizens, communities and local authorities to create cleaner, safer and more sustainable cities.
          </p>
          <p style={{ marginTop: 16, color: 'var(--mint)', fontWeight: 600, fontSize: 14 }}>
            Connecting Citizens. Improving Cities.
          </p>
        </div>

        <nav aria-label="Explore">
          <h2>Explore</h2>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/explore">Explore issues</Link>
            <Link to="/map">City map</Link>
            <Link to="/transparency">Transparency</Link>
          </div>
        </nav>

        <nav aria-label="Get involved">
          <h2>Get involved</h2>
          <div className="footer-links">
            <Link to="/report">Report an issue</Link>
            <Link to="/register">Join the community</Link>
            <Link to="/login">Log in</Link>
            <a href="mailto:support@civicbridge.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mail size={15} aria-hidden="true" /> support@civicbridge.in
            </a>
          </div>
        </nav>
      </div>

      <div className="container footer-meta">
        <p>© {new Date().getFullYear()} CivicBridge. All rights reserved.</p>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Built for better communities <ArrowUpRight size={14} aria-hidden="true" />
        </p>
      </div>
    </footer>
  )
}
