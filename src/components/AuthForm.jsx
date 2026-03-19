import { useMemo, useState } from 'react'

const initialValues = {
  login: {
    email: '',
    password: '',
  },
  register: {
    fullName: '',
    email: '',
    password: '',
  },
}

function AuthForm({ activeMode, loading, onModeChange, onSubmit, statusMessage }) {
  const [values, setValues] = useState(initialValues)

  const fields = useMemo(
    () =>
      activeMode === 'login'
        ? [
            { name: 'email', type: 'email', label: 'Email address', placeholder: 'you@example.com' },
            { name: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password' },
          ]
        : [
            { name: 'fullName', type: 'text', label: 'Full name', placeholder: 'Jane Doe' },
            { name: 'email', type: 'email', label: 'Email address', placeholder: 'you@example.com' },
            {
              name: 'password',
              type: 'password',
              label: 'Password',
              placeholder: 'At least 8 characters, mixed case, 1 number',
            },
          ],
    [activeMode],
  )

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [activeMode]: {
        ...current[activeMode],
        [name]: value,
      },
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(activeMode, values[activeMode])
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="mb-6 flex rounded-full border border-slate-800 bg-slate-950 p-1 text-sm font-medium text-slate-300">
        {['login', 'register'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className={`flex-1 rounded-full px-4 py-2 capitalize transition ${
              activeMode === mode ? 'bg-cyan-500 text-slate-950' : 'hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">{field.label}</span>
            <input
              required
              minLength={field.name === 'password' ? 8 : undefined}
              type={field.type}
              name={field.name}
              value={values[activeMode][field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Please wait...' : activeMode === 'login' ? 'Sign in securely' : 'Create account'}
        </button>
      </form>

      <div className="mt-4 min-h-6 text-sm text-slate-300">{statusMessage}</div>
    </div>
  )
}

export default AuthForm
