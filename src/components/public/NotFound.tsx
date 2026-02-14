import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-500">Página não encontrada</p>
      <Link to="/" className="mt-6">
        <Button variant="secondary">Voltar ao início</Button>
      </Link>
    </div>
  )
}
