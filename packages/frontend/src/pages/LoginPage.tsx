import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import styles from '../styles/components.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/request-code', { email })
      setStep('code')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { sessionId } = await api.post('/auth/verify-code', { email, code })
      login(sessionId)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.contentContainer}>
      <h1>Login</h1>
      
      {step === 'email' ? (
        <form onSubmit={handleRequestCode} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className={styles.form}>
          <p>Enter the 6-digit code sent to {email}</p>
          
          <div className={styles.formGroup}>
            <label htmlFor="code" className={styles.label}>
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          
          <button type="button" onClick={() => setStep('email')}>
            Use different email
          </button>
        </form>
      )}
    </div>
  )
}