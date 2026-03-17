'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchMode = (next : any) => {
    setError('')
    setName('')
    setEmail('')
    setPassword('')
    setMode(next)
  }

  const handleSubmit = async (e : any) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email, password }
        : { name, email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      router.push('/')
    } catch (err : any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f0e8;
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 0%, #e8d5c0 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 90% 100%, #d4c5b0 0%, transparent 55%);
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,252,247,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(200,185,165,0.4);
          border-radius: 20px;
          padding: 48px 44px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .auth-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .brand {
          text-align: center;
          margin-bottom: 36px;
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 400;
          color: #2c2218;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .brand-tagline {
          font-size: 13px;
          font-weight: 300;
          color: #8a7b6a;
          margin-top: 6px;
          letter-spacing: 0.3px;
        }

        .toggle-row {
          display: flex;
          background: rgba(200,185,165,0.2);
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 32px;
        }

        .toggle-btn {
          flex: 1;
          padding: 9px 0;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #8a7b6a;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .toggle-btn.active {
          background: #fff8f0;
          color: #2c2218;
          font-weight: 500;
          box-shadow: 0 1px 4px rgba(90,65,40,0.1);
        }

        .form-group {
          margin-bottom: 18px;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeUp 0.35s ease forwards;
        }

        .form-group:nth-child(1) { animation-delay: 0.05s; }
        .form-group:nth-child(2) { animation-delay: 0.1s; }
        .form-group:nth-child(3) { animation-delay: 0.15s; }
        .form-group:nth-child(4) { animation-delay: 0.2s; }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #6b5c4a;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(180,160,135,0.4);
          border-radius: 10px;
          background: rgba(255,252,247,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #2c2218;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .form-input::placeholder {
          color: #b5a898;
        }

        .form-input:focus {
          border-color: rgba(160,120,80,0.5);
          box-shadow: 0 0 0 3px rgba(180,140,90,0.1);
          background: #fffdf9;
        }

        .error-msg {
          font-size: 13px;
          color: #b05a3a;
          background: rgba(180,80,40,0.07);
          border: 1px solid rgba(180,80,40,0.15);
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 18px;
          animation: fadeUp 0.2s ease forwards;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #2c2218;
          color: #f5f0e8;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 6px;
          letter-spacing: 0.2px;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) {
          background: #3d3025;
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(245,240,232,0.3);
          border-top-color: #f5f0e8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .footer-text {
          text-align: center;
          font-size: 13px;
          color: #8a7b6a;
          margin-top: 24px;
          font-weight: 300;
        }

        .footer-text em {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #5a4535;
          font-size: 14px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(180,160,135,0.25);
        }

        .divider-text {
          font-size: 11px;
          font-weight: 400;
          color: #b5a898;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="auth-root">
        <div className={`auth-card ${mounted ? 'visible' : ''}`}>

          <div className="brand">
            <div className="brand-name">Lock-in</div>
            <div className="brand-tagline">your time, accounted for</div>
          </div>

          <div className="toggle-row">
            <button
              className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
              type="button"
            >
              Sign in
            </button>
            <button
              className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
              type="button"
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} key={mode}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Your name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Alex"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus={mode === 'login'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder={mode === 'register' ? 'Choose a password' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading
                ? mode === 'login' ? 'Signing in…' : 'Creating account…'
                : mode === 'login' ? 'Sign in' : 'Create account'
              }
            </button>
          </form>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">
              {mode === 'login' ? 'new here?' : 'already have an account?'}
            </span>
            <div className="divider-line" />
          </div>

          <div className="footer-text">
            {mode === 'login' ? (
              <>
                First time?{' '}
                <button
                  onClick={() => switchMode('register')}
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <em>Start focusing →</em>
                </button>
              </>
            ) : (
              <>
                Already tracking?{' '}
                <button
                  onClick={() => switchMode('login')}
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <em>Sign back in →</em>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
