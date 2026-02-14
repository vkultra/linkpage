import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema } from '../../lib/validators'
import { signIn } from '../../services/auth.service'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password })
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
      await signIn(result.data)
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="block w-full rounded-xl px-4 py-2.5 text-sm text-white transition-colors placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/30"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: errors.email ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
          }}
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
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="block w-full rounded-xl px-4 py-2.5 text-sm text-white transition-colors placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/30"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: errors.password ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
          }}
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
        Entrar
      </button>

      <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Não tem uma conta?{' '}
        <Link to="/register" className="font-medium text-white/80 transition-colors hover:text-white">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
