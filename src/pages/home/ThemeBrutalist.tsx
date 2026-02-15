/**
 * Tema 3 — "Vivid"
 * Gradiente roxo animado, scroll-reveal "bio page builder", snap mobile
 *
 * Fontes: Bricolage Grotesque (títulos), Inter (corpo)
 * Cores: Gradiente roxo animado, botões claros (branco/cream)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowDown,
  LinkIcon,
  ArrowRight,
  BadgeCheck,
  Activity,
  Infinity,
  SlidersHorizontal,
} from 'lucide-react'

export function ThemeBrutalist() {
  /* ── Scroll-reveal state (advantages section) ── */
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleCards, setVisibleCards] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      let count = 0
      for (const el of triggerRefs.current) {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.75) {
          count++
        }
      }
      setVisibleCards(count)
    }

    container.addEventListener('scroll', update, { passive: true })
    update()
    return () => container.removeEventListener('scroll', update)
  }, [])

  /* ── Demo carousel state ── */
  const [activeIndex, setActiveIndex] = useState(0)
  const [hiding, setHiding] = useState(false)
  const animatingRef = useRef(false)
  const profile = DEMO_PROFILES[activeIndex]

  const advance = useCallback(() => {
    if (animatingRef.current) return
    animatingRef.current = true
    setHiding(true)
    setTimeout(() => {
      setActiveIndex(i => (i + 1) % DEMO_PROFILES.length)
      setHiding(false)
      animatingRef.current = false
    }, 380)
  }, [])

  const goTo = useCallback((idx: number) => {
    if (animatingRef.current || idx === activeIndex) return
    animatingRef.current = true
    setHiding(true)
    setTimeout(() => {
      setActiveIndex(idx)
      setHiding(false)
      animatingRef.current = false
    }, 380)
  }, [activeIndex])

  // Auto-cycle — resets on every profile change
  useEffect(() => {
    const id = setInterval(advance, 4500)
    return () => clearInterval(id)
  }, [activeIndex, advance])

  return (
    <div ref={containerRef} className="vivid-page">
      {/* ══════════ Seção 1 — Hero ══════════ */}
      <section className="vivid-snap relative min-h-screen flex flex-col overflow-hidden">
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

        {/* ── Header — Liquid Glass ── */}
        <header className="relative z-10 px-4 md:px-8 lg:px-16 py-4">
          <div
            className="flex items-center justify-between px-5 md:px-6 py-3 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
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
                rapli.io
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
              Grátis pra sempre
            </div>

            {/* Title */}
            <h1
              className="text-[2rem] sm:text-5xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-white anim-fade-in-up"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Todos os seus links.
              <br />
              Uma <span className="vivid-text-shimmer">bio</span>. Zero custo.
            </h1>

            {/* Subtitle */}
            <p
              className="mt-6 text-base sm:text-lg max-w-xl mx-auto leading-relaxed anim-fade-in-up"
              style={{ color: 'rgba(255,255,255,0.5)', animationDelay: '0.15s' }}
            >
              Crie sua página de links personalizada em minutos.{' '}
              <span className="underline decoration-white/30 underline-offset-4">Temas prontos</span>,{' '}
              <span className="underline decoration-white/30 underline-offset-4">tracking Facebook</span> integrado
              e links ilimitados.
            </p>

            {/* CTA buttons */}
            <div
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center anim-fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              <Link to="/register">
                <button
                  className="px-5 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: '#4c1d95',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  Criar minha bio page grátis
                </button>
              </Link>
              <Link to="/login">
                <button
                  className="px-5 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-2xl transition-all duration-300 hover:bg-white/10 cursor-pointer whitespace-nowrap"
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Já tenho conta
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

          {/* ── Landing page preview mockup — Interactive Demo ── */}
          <div
            className="mt-12 mb-8 w-full max-w-2xl mx-auto anim-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            <div
              className="rounded-2xl overflow-hidden cursor-pointer select-none"
              onClick={advance}
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
                  rapli.io/{profile.username}
                </div>
              </div>

              {/* Embedded mini landing page */}
              <div
                className="relative overflow-hidden"
                style={{ minHeight: '380px', backgroundColor: '#080312' }}
              >
                {/* Background + pattern + orbs — all fade together */}
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: hiding ? 0 : 1,
                    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${profile.bgFrom} 0%, ${profile.bgTo} 100%)`,
                    }}
                  />
                  <DemoPattern type={profile.pattern} accent={profile.accent} />
                  {profile.orbs.map((orb, i) => (
                    <div
                      key={`${activeIndex}-orb-${i}`}
                      className="absolute rounded-full demo-float pointer-events-none"
                      style={{
                        left: orb.x,
                        top: orb.y,
                        width: orb.size,
                        height: orb.size,
                        background: profile.accent,
                        filter: `blur(${orb.blur}px)`,
                        opacity: orb.opacity,
                        animationDelay: `${i * 2}s`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div
                  className="relative z-10 p-8 sm:p-10 flex flex-col items-center"
                  style={{
                    opacity: hiding ? 0 : 1,
                    transform: hiding
                      ? 'scale(0.96) translateY(10px)'
                      : 'scale(1) translateY(0)',
                    filter: hiding ? 'blur(8px)' : 'blur(0px)',
                    transition: 'all 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl"
                    style={{
                      background: profile.avatarGradient,
                      boxShadow: `0 8px 30px ${profile.accent}44`,
                    }}
                  >
                    {profile.emoji}
                  </div>

                  <p className="mt-3 sm:mt-4 text-base sm:text-lg font-bold text-white">
                    @{profile.username}
                  </p>

                  <p
                    className="mt-1.5 text-xs sm:text-sm text-center max-w-[280px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {profile.bio}
                  </p>

                  {/* Link buttons with favicons */}
                  <div className="mt-5 w-full max-w-xs space-y-2.5">
                    {profile.links.map((link) => (
                      <div
                        key={link.label}
                        className="flex items-center gap-3 rounded-xl py-3 px-4 text-sm font-medium"
                        style={{
                          backgroundColor: `${profile.accent}0a`,
                          color: 'rgba(255,255,255,0.65)',
                          border: `1px solid ${profile.accent}15`,
                        }}
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${link.domain}&sz=32`}
                          alt=""
                          className="w-4 h-4 rounded-sm"
                          loading="lazy"
                        />
                        {link.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {DEMO_PROFILES.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); goTo(i) }}
                      className="h-1.5 rounded-full transition-all duration-500 cursor-pointer border-0 p-0"
                      style={{
                        width: i === activeIndex ? 20 : 6,
                        backgroundColor:
                          i === activeIndex
                            ? profile.accent
                            : 'rgba(255,255,255,0.2)',
                      }}
                      aria-label={`Ver perfil ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Click hint */}
            <p
              className="mt-3 text-center text-[11px]"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Clique para explorar mais perfis
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-6 flex justify-center anim-pulse-glow">
          <ArrowDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.25)' }} />
        </div>
      </section>

      {/* ══════════ Seção 2 — Vantagens (Scroll-Reveal Page Builder) ══════════ */}
      <section className="relative" style={{ backgroundColor: '#080312' }}>
        {/* Background ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[15%] left-[-12%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.12]"
            style={{ background: '#7c3aed' }}
          />
          <div
            className="absolute bottom-[25%] right-[-8%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.07]"
            style={{ background: '#a855f7' }}
          />
        </div>

        {/* ── Sticky "landing page" being built ── */}
        <div className="vivid-snap sticky top-0 z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-8">
          <div className="w-full max-w-lg md:max-w-md">
            {/* Profile avatar */}
            <div className="flex justify-center mb-5">
              <div
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  boxShadow: '0 8px 30px rgba(124,58,237,0.3)',
                }}
              >
                <LinkIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            {/* Page title */}
            <div className="text-center mb-8">
              <h2
                className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Tudo que sua{' '}
                <span className="vivid-text-shimmer">bio page</span> precisa
              </h2>
              <p
                className="mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                Recursos que outros cobram caro — aqui são grátis.
              </p>
            </div>

            {/* Card blocks — revealed one by one on scroll */}
            <div className="space-y-3">
              {ADVANTAGES.map((adv, i) => (
                <div
                  key={adv.title}
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: i < visibleCards ? 1 : 0,
                    transform: i < visibleCards
                      ? 'translateY(0) scale(1)'
                      : 'translateY(16px) scale(0.96)',
                  }}
                >
                  <div
                    className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl"
                    style={{
                      background: adv.bg,
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${adv.accent}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: adv.iconBg,
                        boxShadow: `0 0 25px ${adv.glow}`,
                      }}
                    >
                      {adv.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm sm:text-base font-bold text-white"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                      >
                        {adv.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm leading-snug mt-0.5 line-clamp-2"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {adv.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini CTA — appears after all cards are revealed */}
            <div
              className="mt-5 transition-all duration-500 ease-out"
              style={{
                opacity: visibleCards >= ADVANTAGES.length ? 1 : 0,
                transform:
                  visibleCards >= ADVANTAGES.length
                    ? 'translateY(0) scale(1)'
                    : 'translateY(16px) scale(0.96)',
              }}
            >
              <Link to="/register">
                <button
                  className="w-full py-4 rounded-2xl text-base font-bold text-white cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
                  }}
                >
                  Criar minha bio page grátis
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Invisible scroll triggers (snap points on mobile) ── */}
        {ADVANTAGES.map((_, i) => (
          <div
            key={`trigger-${i}`}
            ref={(el) => {
              triggerRefs.current[i] = el
            }}
            className="vivid-snap h-screen"
            aria-hidden="true"
          />
        ))}
      </section>

      {/* ══════════ Seção 3 — CTA Final ══════════ */}
      <section
        className="vivid-snap relative overflow-hidden flex flex-col"
        style={{ backgroundColor: '#080312' }}
      >
        {/* Top gradient divider */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }}
        />

        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px] opacity-[0.08] pointer-events-none"
          style={{ background: '#7c3aed' }}
        />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-36">
          <div className="text-center max-w-3xl">
            <h2
              className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Seu link na bio pode{' '}
              <br className="hidden sm:block" />
              ser <span style={{ color: '#c084fc' }}>muito mais</span>.
            </h2>
            <p
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-lg mx-auto"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Crie sua bio page em 2 minutos. Grátis pra sempre, sem cartão de crédito.
            </p>
            <Link to="/register">
              <button
                className="group mt-10 px-10 py-4 text-base sm:text-lg font-bold rounded-2xl text-white transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  boxShadow: '0 8px 40px rgba(124,58,237,0.35)',
                }}
              >
                Criar minha bio page grátis
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <p className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Grátis pra sempre · Sem cartão de crédito · Sem limites
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Static data ── */

const HIGHLIGHTS = ['Grátis pra sempre', 'Links ilimitados', 'Tracking Facebook', 'Personalização total']

/* ── Demo profiles data ── */

interface DemoLink {
  label: string
  domain: string
}

interface DemoOrb {
  x: string
  y: string
  size: number
  blur: number
  opacity: number
}

interface DemoProfile {
  username: string
  bio: string
  emoji: string
  links: DemoLink[]
  avatarGradient: string
  bgFrom: string
  bgTo: string
  accent: string
  pattern: string
  orbs: DemoOrb[]
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    username: 'helder',
    bio: 'Dev full-stack & criador de conteúdo tech. Construindo o futuro, uma linha de código por vez.',
    emoji: '👨‍💻',
    links: [
      { label: 'Portfolio', domain: 'github.io' },
      { label: 'GitHub', domain: 'github.com' },
      { label: 'LinkedIn', domain: 'linkedin.com' },
      { label: 'YouTube', domain: 'youtube.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    bgFrom: '#1a0a2e',
    bgTo: '#0f0520',
    accent: '#a78bfa',
    pattern: 'circuit',
    orbs: [
      { x: '15%', y: '20%', size: 80, blur: 40, opacity: 0.15 },
      { x: '85%', y: '70%', size: 60, blur: 35, opacity: 0.12 },
    ],
  },
  {
    username: 'marina',
    bio: 'Designer de interfaces & ilustradora digital. Transformando ideias em experiências visuais inesquecíveis.',
    emoji: '🎨',
    links: [
      { label: 'Behance', domain: 'behance.net' },
      { label: 'Dribbble', domain: 'dribbble.com' },
      { label: 'Instagram', domain: 'instagram.com' },
      { label: 'Minha Loja', domain: 'shopify.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #f43f5e, #fb923c)',
    bgFrom: '#2a0a14',
    bgTo: '#1a0510',
    accent: '#fb7185',
    pattern: 'circles',
    orbs: [
      { x: '80%', y: '25%', size: 70, blur: 35, opacity: 0.18 },
      { x: '20%', y: '75%', size: 50, blur: 30, opacity: 0.12 },
      { x: '60%', y: '50%', size: 40, blur: 25, opacity: 0.08 },
    ],
  },
  {
    username: 'lucas',
    bio: 'Produtor musical & DJ. Criando batidas que fazem sua alma dançar. Ouça meu novo EP! 🎵',
    emoji: '🎵',
    links: [
      { label: 'Spotify', domain: 'spotify.com' },
      { label: 'SoundCloud', domain: 'soundcloud.com' },
      { label: 'YouTube', domain: 'youtube.com' },
      { label: 'TikTok', domain: 'tiktok.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bgFrom: '#0a1a2e',
    bgTo: '#050f20',
    accent: '#22d3ee',
    pattern: 'waves',
    orbs: [
      { x: '10%', y: '30%', size: 90, blur: 45, opacity: 0.12 },
      { x: '90%', y: '80%', size: 55, blur: 30, opacity: 0.15 },
    ],
  },
  {
    username: 'julia',
    bio: 'Fotógrafa de natureza & viagens. Capturando momentos que contam histórias pelo mundo.',
    emoji: '📷',
    links: [
      { label: 'Instagram', domain: 'instagram.com' },
      { label: '500px', domain: '500px.com' },
      { label: 'Portfolio', domain: 'squarespace.com' },
      { label: 'Pinterest', domain: 'pinterest.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #14b8a6, #10b981)',
    bgFrom: '#0a2420',
    bgTo: '#051510',
    accent: '#2dd4bf',
    pattern: 'crosshair',
    orbs: [
      { x: '75%', y: '20%', size: 65, blur: 35, opacity: 0.14 },
      { x: '25%', y: '80%', size: 45, blur: 25, opacity: 0.1 },
    ],
  },
  {
    username: 'rafael',
    bio: 'Personal trainer & nutricionista esportivo. Te ajudando a alcançar sua melhor versão! 💪',
    emoji: '🏋️',
    links: [
      { label: 'Instagram', domain: 'instagram.com' },
      { label: 'YouTube', domain: 'youtube.com' },
      { label: 'Meu App', domain: 'myfitnesspal.com' },
      { label: 'WhatsApp', domain: 'whatsapp.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #84cc16, #22c55e)',
    bgFrom: '#0a2010',
    bgTo: '#051208',
    accent: '#a3e635',
    pattern: 'chevrons',
    orbs: [
      { x: '20%', y: '25%', size: 75, blur: 40, opacity: 0.13 },
      { x: '80%', y: '60%', size: 55, blur: 30, opacity: 0.16 },
      { x: '50%', y: '85%', size: 40, blur: 25, opacity: 0.08 },
    ],
  },
  {
    username: 'camila',
    bio: 'Escritora, podcaster & apaixonada por histórias que inspiram e transformam vidas.',
    emoji: '✍️',
    links: [
      { label: 'Podcast', domain: 'podcasts.apple.com' },
      { label: 'Medium', domain: 'medium.com' },
      { label: 'Twitter / X', domain: 'x.com' },
      { label: 'Newsletter', domain: 'substack.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    bgFrom: '#2a1a08',
    bgTo: '#1a0f04',
    accent: '#fbbf24',
    pattern: 'dashes',
    orbs: [
      { x: '85%', y: '30%', size: 60, blur: 30, opacity: 0.15 },
      { x: '15%', y: '65%', size: 70, blur: 35, opacity: 0.12 },
    ],
  },
  {
    username: 'pedro',
    bio: 'Streamer & gamer profissional. Live todos os dias às 19h. Bora jogar! 🎮',
    emoji: '🎮',
    links: [
      { label: 'Twitch', domain: 'twitch.tv' },
      { label: 'Discord', domain: 'discord.com' },
      { label: 'YouTube', domain: 'youtube.com' },
      { label: 'Twitter / X', domain: 'x.com' },
    ],
    avatarGradient: 'linear-gradient(135deg, #d946ef, #06b6d4)',
    bgFrom: '#1a0a28',
    bgTo: '#0f0518',
    accent: '#e879f9',
    pattern: 'pixels',
    orbs: [
      { x: '10%', y: '20%', size: 65, blur: 35, opacity: 0.16 },
      { x: '90%', y: '45%', size: 50, blur: 25, opacity: 0.14 },
      { x: '45%', y: '85%', size: 45, blur: 25, opacity: 0.1 },
    ],
  },
]

/* ── SVG Pattern component ── */

const PATTERN_DEFS: Record<string, { w: number; h: number; content: React.ReactNode }> = {
  circuit: {
    w: 30, h: 30,
    content: (
      <>
        <circle cx="15" cy="15" r="1.5" fill="currentColor" />
        <path d="M15 0v15h15" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </>
    ),
  },
  circles: {
    w: 50, h: 50,
    content: (
      <>
        <circle cx="25" cy="25" r="12" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="8" cy="8" r="4" fill="currentColor" fillOpacity="0.3" />
      </>
    ),
  },
  waves: {
    w: 80, h: 20,
    content: (
      <path
        d="M0 10Q20 0 40 10Q60 20 80 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      />
    ),
  },
  crosshair: {
    w: 40, h: 40,
    content: (
      <path
        d="M0 0h6M0 0v6M40 0h-6M40 0v6M0 40h6M0 40v-6M40 40h-6M40 40v-6"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
    ),
  },
  chevrons: {
    w: 24, h: 28,
    content: (
      <path
        d="M2 22L12 6l10 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
    ),
  },
  dashes: {
    w: 40, h: 20,
    content: (
      <>
        <line x1="2" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="36" cy="10" r="1" fill="currentColor" fillOpacity="0.5" />
      </>
    ),
  },
  pixels: {
    w: 18, h: 18,
    content: (
      <>
        <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.6" />
        <rect x="10" y="10" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
      </>
    ),
  },
}

function DemoPattern({ type, accent }: { type: string; accent: string }) {
  const def = PATTERN_DEFS[type]
  if (!def) return null
  const id = `dp-${type}`
  return (
    <svg
      className="absolute inset-0 w-full h-full demo-pattern-drift"
      style={{ color: accent, opacity: 0.14 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width={def.w} height={def.h} patternUnits="userSpaceOnUse">
          {def.content}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

const ADVANTAGES = [
  {
    icon: <BadgeCheck className="w-5 h-5" style={{ color: '#4ade80' }} />,
    title: '100% Grátis',
    desc: 'Todos os recursos liberados, sem plano pago escondido. Sem pegadinha.',
    bg: 'linear-gradient(145deg, #0a1f14 0%, #14352a 50%, #0a1f14 100%)',
    iconBg: 'rgba(74,222,128,0.12)',
    accent: '#4ade80',
    glow: 'rgba(74,222,128,0.15)',
  },
  {
    icon: <Activity className="w-5 h-5" style={{ color: '#f0abfc' }} />,
    title: 'Facebook Pixel Integrado',
    desc: 'Rastreie conversões direto da sua bio page. Grátis, sem ferramentas extras.',
    bg: 'linear-gradient(145deg, #200d38 0%, #3b1868 50%, #200d38 100%)',
    iconBg: 'rgba(240,171,252,0.10)',
    accent: '#f0abfc',
    glow: 'rgba(240,171,252,0.12)',
  },
  {
    icon: <Infinity className="w-5 h-5" style={{ color: '#38bdf8' }} />,
    title: 'Links Ilimitados',
    desc: 'Adicione quantos links quiser. Sem trava, sem upgrade forçado.',
    bg: 'linear-gradient(145deg, #0a1828 0%, #143050 50%, #0a1828 100%)',
    iconBg: 'rgba(56,189,248,0.12)',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.15)',
  },
  {
    icon: <SlidersHorizontal className="w-5 h-5" style={{ color: '#fb923c' }} />,
    title: 'Personalização Total',
    desc: 'Temas, cores, fontes e avatar — cada detalhe do seu jeito.',
    bg: 'linear-gradient(145deg, #1f1008 0%, #3a2010 50%, #1f1008 100%)',
    iconBg: 'rgba(251,146,60,0.12)',
    accent: '#fb923c',
    glow: 'rgba(251,146,60,0.15)',
  },
]
