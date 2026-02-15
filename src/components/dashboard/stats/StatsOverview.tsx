import { Eye, Users, MousePointerClick, TrendingUp } from 'lucide-react'
import { Card } from '../../ui/Card'
import type { AnalyticsSummary } from '../../../types'

interface StatsOverviewProps {
  summary: AnalyticsSummary | null
  loading: boolean
}

export function StatsOverview({ summary, loading }: StatsOverviewProps) {
  const ctr =
    summary && summary.total_views > 0
      ? ((summary.total_clicks / summary.total_views) * 100).toFixed(1)
      : '0.0'

  const cards = [
    {
      label: 'Visualizações',
      value: summary?.total_views ?? 0,
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Visitantes únicos',
      value: summary?.unique_visitors ?? 0,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Cliques',
      value: summary?.total_clicks ?? 0,
      icon: MousePointerClick,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
      label: 'CTR',
      value: `${ctr}%`,
      icon: TrendingUp,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="flex items-center gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.bg}`}>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-slate-400">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-50">
              {loading ? '—' : card.value.toLocaleString('pt-BR')}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
