import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { LinkIcon, Palette, GripVertical, Globe } from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
              <LinkIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">LinkPage</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Todos os seus links em um só lugar
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
          Crie landing pages personalizadas para compartilhar seus links, redes sociais e conteúdo. Simples, rápido e bonito.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Começar grátis</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Palette className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">5 Temas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Light, dark, gradient, neon e glassmorphism para personalizar seu estilo.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <GripVertical className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Drag & Drop</h3>
            <p className="mt-1 text-sm text-gray-500">
              Reordene seus links arrastando e soltando. Fácil e intuitivo.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Globe className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Múltiplas Páginas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie quantas landing pages quiser. Uma para cada projeto ou objetivo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        LinkPage &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
