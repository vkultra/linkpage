import { useCallback, useEffect, useState } from 'react'
import {
  getAnalyticsSummary,
  getViewsByDay,
  getTopLinks,
  getHourlyDistribution,
  getGeoDistribution,
} from '../services/analytics.service'
import type { AnalyticsSummary, ViewByDay, TopLink, HourlyData, GeoData } from '../types'

interface DateRange {
  start: Date
  end: Date
}

interface UseAnalyticsResult {
  summary: AnalyticsSummary | null
  viewsByDay: ViewByDay[]
  topLinks: TopLink[]
  hourly: HourlyData[]
  geo: GeoData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAnalytics(landingPageId: string | null, dateRange: DateRange): UseAnalyticsResult {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [viewsByDay, setViewsByDay] = useState<ViewByDay[]>([])
  const [topLinks, setTopLinks] = useState<TopLink[]>([])
  const [hourly, setHourly] = useState<HourlyData[]>([])
  const [geo, setGeo] = useState<GeoData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [summaryData, viewsData, linksData, hourlyData, geoData] = await Promise.all([
        getAnalyticsSummary(landingPageId, dateRange.start, dateRange.end),
        getViewsByDay(landingPageId, dateRange.start, dateRange.end),
        getTopLinks(landingPageId, dateRange.start, dateRange.end),
        getHourlyDistribution(landingPageId, dateRange.start, dateRange.end),
        getGeoDistribution(landingPageId, dateRange.start, dateRange.end),
      ])

      setSummary(summaryData)
      setViewsByDay(viewsData)
      setTopLinks(linksData)
      setHourly(hourlyData)
      setGeo(geoData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar estatísticas'
      setError(message)
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [landingPageId, dateRange.start, dateRange.end])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { summary, viewsByDay, topLinks, hourly, geo, loading, error, refetch: fetchData }
}
