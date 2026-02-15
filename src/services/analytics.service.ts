import { supabase } from '../lib/supabase'
import type { AnalyticsSummary, ViewByDay, TopLink, HourlyData, GeoData } from '../types'

export async function getAnalyticsSummary(
  pageId: string | null,
  start: Date,
  end: Date
): Promise<AnalyticsSummary> {
  const { data, error } = await supabase.rpc('get_analytics_summary', {
    p_landing_page_id: pageId as string,
    p_start: start.toISOString(),
    p_end: end.toISOString(),
  })

  if (error) throw error
  return (data as unknown as AnalyticsSummary) ?? { total_views: 0, unique_visitors: 0, total_clicks: 0, unique_clickers: 0 }
}

export async function getViewsByDay(
  pageId: string | null,
  start: Date,
  end: Date
): Promise<ViewByDay[]> {
  const { data, error } = await supabase.rpc('get_views_by_day', {
    p_landing_page_id: pageId as string,
    p_start: start.toISOString(),
    p_end: end.toISOString(),
  })

  if (error) throw error
  return (data as ViewByDay[]) ?? []
}

export async function getTopLinks(
  pageId: string | null,
  start: Date,
  end: Date
): Promise<TopLink[]> {
  const { data, error } = await supabase.rpc('get_top_links', {
    p_landing_page_id: pageId as string,
    p_start: start.toISOString(),
    p_end: end.toISOString(),
  })

  if (error) throw error
  return (data as TopLink[]) ?? []
}

export async function getHourlyDistribution(
  pageId: string | null,
  start: Date,
  end: Date
): Promise<HourlyData[]> {
  const { data, error } = await supabase.rpc('get_hourly_distribution', {
    p_landing_page_id: pageId as string,
    p_start: start.toISOString(),
    p_end: end.toISOString(),
  })

  if (error) throw error
  return (data as HourlyData[]) ?? []
}

export async function getGeoDistribution(
  pageId: string | null,
  start: Date,
  end: Date
): Promise<GeoData[]> {
  const { data, error } = await supabase.rpc('get_geo_distribution', {
    p_landing_page_id: pageId as string,
    p_start: start.toISOString(),
    p_end: end.toISOString(),
  })

  if (error) throw error
  return (data as GeoData[]) ?? []
}
