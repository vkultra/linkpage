import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerSchema } from '../../lib/validators'
import { signUp } from '../../services/auth.service'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

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
      <Input
        id="fullName"
        label="Nome completo"
        placeholder="Seu nome"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        autoComplete="name"
      />
      <Input
        id="username"
        label="Username"
        placeholder="meu-username"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
        error={errors.username}
        autoComplete="username"
      />
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
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />
      <Button type="submit" loading={loading} className="w-full">
        Criar conta
      </Button>
      <p className="text-center text-sm text-gray-600">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-medium text-gray-900 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
