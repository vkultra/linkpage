import { useState, useMemo } from 'react'
import { startOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { useAnalytics } from '../hooks/useAnalytics'
import { PageSelector } from '../components/dashboard/stats/PageSelector'
import { DateFilter, type Preset } from '../components/dashboard/stats/DateFilter'
import { StatsOverview } from '../components/dashboard/stats/StatsOverview'
import { ViewsChart } from '../components/dashboard/stats/ViewsChart'
import { TopLinksChart } from '../components/dashboard/stats/TopLinksChart'
import { HourlyChart } from '../components/dashboard/stats/HourlyChart'
import { BrazilMap } from '../components/dashboard/stats/BrazilMap'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Card } from '../components/ui/Card'

function getPresetDates(preset: Preset): { start: Date; end: Date } {
  const now = new Date()

  switch (preset) {
    case 'today':
      return { start: startOfDay(now), end: now }
    case '7d': {
      const start = new Date(now)
      start.setDate(start.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      return { start, end: now }
    }
    case 'month':
      return { start: startOfMonth(now), end: now }
    case 'last-month': {
      const lastMonth = subMonths(now, 1)
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
    }
    default: {
      const start = new Date(now)
      start.setDate(start.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      return { start, end: now }
    }
  }
}

export function StatsPage() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [preset, setPreset] = useState<Preset>('7d')
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | null>(null)

  const dateRange = useMemo(() => {
    if (preset === 'custom' && customRange) {
      return customRange
    }
    return getPresetDates(preset)
  }, [preset, customRange])

  const { summary, viewsByDay, topLinks, hourly, geo, loading, error } =
    useAnalytics(selectedPageId, dateRange)

  function handlePresetChange(p: Preset) {
    setPreset(p)
    setCustomRange(null)
  }

  function handleCustomRangeChange(range: { start: Date; end: Date }) {
    setPreset('custom')
    setCustomRange(range)
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <Card className="!p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-slate-50">
              Estatísticas
            </h1>
            <PageSelector value={selectedPageId} onChange={setSelectedPageId} />
          </div>
          <DateFilter
            preset={preset}
            dateRange={dateRange}
            onPresetChange={handlePresetChange}
            onCustomRangeChange={handleCustomRangeChange}
          />
        </div>
      </Card>

      {error ? (
        <div className="py-20 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {loading && !summary && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* KPI Cards */}
          <StatsOverview summary={summary} loading={loading} />

          {/* Views Line Chart */}
          <ViewsChart data={viewsByDay} loading={loading} />

          {/* Two-column: Top Links + Hourly */}
          <div className="grid gap-6 lg:grid-cols-2">
            <TopLinksChart data={topLinks} loading={loading} />
            <HourlyChart data={hourly} loading={loading} />
          </div>

          {/* Brazil Map */}
          <BrazilMap data={geo} loading={loading} />
        </>
      )}
    </div>
  )
}
