/**
 * Tema 3 — "Vivid"
 * Inspirado em outseta.com — gradiente roxo animado, preview embutido, snap scroll
 *
 * Fontes: Bricolage Grotesque (títulos), Inter (corpo)
 * Cores: Gradiente roxo animado, botões claros (branco/cream)
 */

import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowDown,
  Palette,
  GripVertical,
  Layers,
  Globe,
  LinkIcon,
} from 'lucide-react'

export function ThemeBrutalist() {
  return (
    <div className="snap-container">
      {/* ══════════ Seção 1 — Hero ══════════ */}
      <section className="snap-section relative overflow-hidden">
        {/* Animated purple gradient */}
        <div className="vivid-gradient absolute inset-0" />

        {/* Decorative blur orbs */}
        <div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[10%] left-[-8%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, #e879f9 0%, transparent 70%)' }}
        />

        {/* ── Header ── */}
        <header className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <LinkIcon className="h-4 w-4 text-white" />
            </div>
            <span
              className="text-lg font-bold tracking-tight text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              LinkPage
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer">
                Entrar
              </button>
            </Link>
            <Link to="/register">
              <button
                className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#4c1d95' }}
              >
                Criar conta
              </button>
            </Link>
          </div>
        </header>

        {/* ── Hero content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 anim-fade-in"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={13} />
              Plataforma de Landing Pages
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-white anim-fade-in-up"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Crie Sua Landing Page
              <br />
              <span className="vivid-text-shimmer">Profissional</span> em Minutos
            </h1>

            {/* Subtitle */}
            <p
              className="mt-6 text-base sm:text-lg max-w-xl mx-auto leading-relaxed anim-fade-in-up"
              style={{ color: 'rgba(255,255,255,0.5)', animationDelay: '0.15s' }}
            >
              Tudo que você precisa para criar páginas incríveis, de{' '}
              <span className="underline decoration-white/30 underline-offset-4">temas prontos</span> a{' '}
              <span className="underline decoration-white/30 underline-offset-4">personalização</span> total.
            </p>

            {/* CTA buttons */}
            <div
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center anim-fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              <Link to="/register">
                <button
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: '#4c1d95',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  Criar conta grátis
                </button>
              </Link>
              <Link to="/login">
                <button
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-2xl transition-all duration-300 hover:bg-white/10 cursor-pointer"
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Entrar na plataforma
                </button>
              </Link>
            </div>

            {/* Quick highlights */}
            <div
              className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.15em] anim-fade-in-up"
              style={{ color: 'rgba(255,255,255,0.35)', animationDelay: '0.4s' }}
            >
              {HIGHLIGHTS.map((tag, i) => (
                <span key={tag} className="flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-white/20" />}
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Landing page preview mockup ── */}
          <div
            className="mt-12 mb-8 w-full max-w-2xl mx-auto anim-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  '0 50px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* Browser chrome bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ backgroundColor: 'rgba(12,5,22,0.97)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
                </div>
                <div
                  className="flex-1 mx-4 px-4 py-1 rounded-md text-[11px] text-center truncate"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.22)',
                  }}
                >
                  linkpage.app/helder
                </div>
              </div>

              {/* Embedded mini landing page */}
              <div
                className="p-8 sm:p-10 flex flex-col items-center"
                style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0f0520 100%)' }}
              >
                {/* Avatar */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    boxShadow: '0 8px 30px rgba(124,58,237,0.35)',
                  }}
                />
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold text-white">
                  @helder
                </h3>
                <p
                  className="mt-1 text-xs sm:text-sm"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  Developer &amp; Creator
                </p>

                {/* Link buttons */}
                <div className="mt-5 w-full max-w-xs space-y-2.5">
                  {PREVIEW_LINKS.map((name) => (
                    <div
                      key={name}
                      className="rounded-xl py-3 text-center text-sm font-medium"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.65)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-6 flex justify-center anim-pulse-glow">
          <ArrowDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.25)' }} />
        </div>
      </section>

      {/* ══════════ Seção 2 — Vantagens (snap) ══════════ */}
      <section className="snap-section relative" style={{ backgroundColor: '#faf7ff' }}>
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-5xl w-full">
            {/* Section header */}
            <div className="text-center mb-14">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}
              >
                Vantagens da plataforma
              </span>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: '#1a0a2e',
                }}
              >
                Tudo para você{' '}
                <span style={{ color: '#7c3aed' }}>brilhar</span> online
              </h2>
              <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: '#6b7280' }}>
                Ferramentas profissionais, sem complicação e totalmente grátis.
              </p>
            </div>

            {/* Advantage cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ADVANTAGES.map((adv) => (
                <div
                  key={adv.title}
                  className="group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5"
                  style={{ borderColor: '#ede9fe', backgroundColor: 'white' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#f3e8ff' }}
                  >
                    {adv.icon}
                  </div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: '#1a0a2e' }}>
                    {adv.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-14 text-center">
              <Link to="/register">
                <button
                  className="px-8 py-3.5 text-base font-semibold rounded-2xl text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #6d28d9, #a855f7)',
                    boxShadow: '0 8px 30px rgba(109,40,217,0.25)',
                  }}
                >
                  Começar agora — é grátis
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Static data ── */

const HIGHLIGHTS = ['5 Temas', 'Drag & Drop', 'Múltiplas Páginas']

const PREVIEW_LINKS = ['Portfolio', 'GitHub', 'LinkedIn', 'YouTube']

const ADVANTAGES = [
  {
    icon: <Palette className="w-5 h-5" style={{ color: '#7c3aed' }} />,
    title: '5 Temas Profissionais',
    desc: 'Light, dark, gradient, neon e glassmorphism para todos os estilos.',
  },
  {
    icon: <GripVertical className="w-5 h-5" style={{ color: '#7c3aed' }} />,
    title: 'Drag & Drop',
    desc: 'Reordene seus links arrastando e soltando — simples e intuitivo.',
  },
  {
    icon: <Layers className="w-5 h-5" style={{ color: '#7c3aed' }} />,
    title: 'Múltiplas Páginas',
    desc: 'Crie quantas landing pages quiser em uma única conta.',
  },
  {
    icon: <Globe className="w-5 h-5" style={{ color: '#7c3aed' }} />,
    title: 'Link Público',
    desc: 'Compartilhe com linkpage.app/seunome — fácil de lembrar.',
  },
]
