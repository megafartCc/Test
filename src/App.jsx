import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.')
  }

  return data
}

function App() {
  const [activeMode, setActiveMode] = useState('register')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Use the form below to create an account or sign in.')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await request('/api/auth/me')
        setUser(data.user)
        setStatusMessage(`Welcome back, ${data.user.fullName}.`)
      } catch (_error) {
        setUser(null)
      }
    }

    loadUser()
  }, [])

  async function handleSubmit(mode, values) {
    setLoading(true)
    setStatusMessage('')

    try {
      const data = await request(`/api/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(values),
      })

      setUser(data.user)
      setStatusMessage(data.message)
      setActiveMode('login')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)

    try {
      await request('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setStatusMessage('You have been logged out.')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              Secure MySQL-backed authentication
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Register or sign in to your account.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                This frontend is now focused on authentication, with a matching Express + MySQL backend that uses environment variables, hashed passwords, prepared statements, and HTTP-only cookies.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                'Uses MYSQL_DATABASE / MYSQL_HOST / MYSQL_PASSWORD / MYSQL_PORT / MYSQL_URL / MYSQL_USER',
                'Passwords are hashed with bcrypt before storage',
                'MySQL queries use prepared statements for safer input handling',
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
              <p className="font-semibold text-white">Backend setup checklist</p>
              <ul className="mt-3 space-y-2">
                <li>1. Copy <code className="text-cyan-300">.env.example</code> to <code className="text-cyan-300">.env</code>.</li>
                <li>2. Fill in your MySQL credentials or set <code className="text-cyan-300">MYSQL_URL</code>.</li>
                <li>3. Run the SQL in <code className="text-cyan-300">server/schema.sql</code>.</li>
                <li>4. Start the backend with <code className="text-cyan-300">npm run dev:server</code>.</li>
              </ul>
            </div>
          </section>

          <section>
            {user ? (
              <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Authenticated</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Welcome, {user.fullName}</h2>
                <dl className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 pb-3">
                    <dt>User ID</dt>
                    <dd>{user.id}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="mt-6 w-full rounded-2xl border border-slate-700 px-4 py-3 font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Log out
                </button>
              </div>
            ) : (
              <AuthForm
                activeMode={activeMode}
                loading={loading}
                onModeChange={setActiveMode}
                onSubmit={handleSubmit}
                statusMessage={statusMessage}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
