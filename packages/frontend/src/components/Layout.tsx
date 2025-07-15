import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/components.module.css'

export function Layout() {
  const { user, logout } = useAuth()

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link to="/" className={styles.logo}>
              Paper
            </Link>
            <ul className={styles.navLinks}>
              <li>
                <Link to="/">Browse</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/editor">New Paper</Link>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}