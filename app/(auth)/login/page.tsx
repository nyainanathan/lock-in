'use client'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(true)
  const router = useRouter();

  const checkAuth = async () => {
      try {
        const req = await fetch(`/api/auth/me`, {
          credentials: 'include',
        });
        if (!req.ok) return;
        const userIdData = await req.json();
        
        if (userIdData.userId) {
          redirect('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
  }

  useEffect(() => {
    checkAuth();
  }, []);

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
        

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'DM Sans', sans-serif;
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 16px;
          padding: 48px 44px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .brand-tagline {
          font-size: 13px;
          font-weight: 400;
          color: #6b7280;
          margin-top: 6px;
          letter-spacing: 0.3px;
        }

        .toggle-row {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 1px solid #e5e7eb;
        }

        .toggle-btn {
          flex: 1;
          padding: 12px 0;
          border: none;
          background: transparent;
          border-bottom: 2px solid transparent;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .toggle-btn.active {
          color: #1f2937;
          border-bottom-color: #1f2937;
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
          color: #4b5563;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
          font-family: inherit;
          font-size: 15px;
          font-weight: 400;
          color: #1f2937;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .form-input::placeholder {
          color: #d1d5db;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: white;
        }

        .error-msg {
          font-size: 13px;
          color: #dc2626;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 18px;
          animation: fadeUp 0.2s ease forwards;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #1f2937;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 6px;
          letter-spacing: 0.2px;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) {
          background: #111827;
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
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
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
          color: #6b7280;
          margin-top: 24px;
          font-weight: 400;
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
          background: #e5e7eb;
        }

        .divider-text {
          font-size: 11px;
          font-weight: 400;
          color: #9ca3af;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="auth-root">
        <div className={`auth-card ${mounted ? 'visible' : ''}`}>

          <div className="brand">
            <div className="brand-name">🔒 Lock-in</div>
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
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1f2937', fontWeight: '600' }}
                >
                  Start focusing →
                </button>
              </>
            ) : (
              <>
                Already tracking?{' '}
                <button
                  onClick={() => switchMode('login')}
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1f2937', fontWeight: '600' }}
                >
                  Sign back in →
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
