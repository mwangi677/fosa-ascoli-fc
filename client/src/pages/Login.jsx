import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const ICONS = {
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  arrowLeft: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) { setError('Please enter username and password'); return }
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'var(--surface-alt)',
      position: 'relative',
    }}>
      <div className="card" style={{
        width: '100%', maxWidth: 420, padding: '2.5rem',
        animation: 'slideUp 0.4s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/logo.png"
            alt="Fosa Ascoli FC crest"
            style={{ width: 64, height: 64, objectFit: 'contain', margin: '0 auto 1rem', display: 'block', filter: 'drop-shadow(0 0 8px oklch(0% 0 0 / 0.3))', borderRadius: 4 }}
          />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.5rem',
            fontWeight: 600, letterSpacing: '0.02em',
            marginBottom: '0.25rem',
          }}>
            Admin Login
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
            Fosa Ascoli FC — Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--fg-subtle)', display: 'flex',
              }}>{ICONS.user}</span>
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--fg-subtle)', display: 'flex',
              }}>{ICONS.lock}</span>
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 500,
              background: 'var(--accent-red / 0.1)', color: 'var(--error)',
              borderRadius: 8, border: '1px solid var(--error / 0.2)',
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} /> : ICONS.shield}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.85rem', color: 'var(--fg-muted)',
            transition: 'color 0.2s ease',
          }}>
            {ICONS.arrowLeft} Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
