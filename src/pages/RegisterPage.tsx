import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { RegisterForm } from '../components/auth/RegisterForm'
import { LinkIcon } from 'lucide-react'

export function RegisterPage() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated purple gradient background */}
      <div className="vivid-gradient absolute inset-0" />

      {/* Decorative blur orbs */}
      <div
        className="pointer-events-none absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[10%] left-[-8%] h-[400px] w-[400px] rounded-full opacity-25 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #e879f9 0%, transparent 70%)' }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm anim-fade-in-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Criar conta
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Comece a criar suas bio pages
          </p>
        </div>

        {/* Glassmorphism form card */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          }}
        >
          <RegisterForm />
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Link to="/" className="transition-colors hover:text-white/60">
            &larr; Voltar para a home
          </Link>
        </p>
      </div>
    </div>
  )
}
