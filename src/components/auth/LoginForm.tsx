import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema } from '../../lib/validators'
import { signIn } from '../../services/auth.service'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
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
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
      />
      <Button type="submit" loading={loading} className="w-full">
        Entrar
      </Button>
      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <Link to="/register" className="font-medium text-gray-900 hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
