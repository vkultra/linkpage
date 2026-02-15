import { useLandingPages } from '../../../hooks/useLandingPages'

interface PageSelectorProps {
  value: string | null
  onChange: (pageId: string | null) => void
}

export function PageSelector({ value, onChange }: PageSelectorProps) {
  const { pages, loading } = useLandingPages()

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={loading}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    >
      <option value="">
        {loading ? 'Carregando...' : 'Todas as páginas'}
      </option>
      {pages.map((p) => (
        <option key={p.id} value={p.id}>
          {p.title || p.slug}
        </option>
      ))}
    </select>
  )
}
