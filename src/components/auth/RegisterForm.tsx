import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerSchema } from '../../lib/validators'
import { signUp } from '../../services/auth.service'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const inputClassName =
  'block w-full rounded-xl px-4 py-2.5 text-sm text-white transition-colors placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/30'

function inputStyle(hasError: boolean) {
  return {
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: hasError ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
  }
}

export function RegisterForm() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = registerSchema.safeParse({ fullName, username, email, password })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await signUp(result.data)
      toast.success('Conta criada com sucesso!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Nome completo
        </label>
        <input
          id="fullName"
          placeholder="Seu nome"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          className={inputClassName}
          style={inputStyle(!!errors.fullName)}
        />
        {errors.fullName && <p className="text-xs" style={{ color: '#fca5a5' }}>{errors.fullName}</p>}
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Username
        </label>
        <input
          id="username"
          placeholder="meu-username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          autoComplete="username"
          className={inputClassName}
          style={inputStyle(!!errors.username)}
        />
        {errors.username && <p className="text-xs" style={{ color: '#fca5a5' }}>{errors.username}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={inputClassName}
          style={inputStyle(!!errors.email)}
        />
        {errors.email && <p className="text-xs" style={{ color: '#fca5a5' }}>{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className={inputClassName}
          style={inputStyle(!!errors.password)}
        />
        {errors.password && <p className="text-xs" style={{ color: '#fca5a5' }}>{errors.password}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          color: '#4c1d95',
        }}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Criar conta
      </button>

      <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Já tem uma conta?{' '}
        <Link to="/login" className="font-medium text-white/80 transition-colors hover:text-white">
          Entrar
        </Link>
      </p>
    </form>
  )
}
