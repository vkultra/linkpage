import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { Card } from '../../ui/Card'
import type { GeoData } from '../../../types'

interface BrazilMapProps {
  data: GeoData[]
  loading: boolean
}

const GEO_URL = '/brazil-states.json'

// Map full state names to UF abbreviations
const STATE_TO_UF: Record<string, string> = {
  'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
  'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
  'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
  'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
  'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO',
}

// Reverse map: UF → full name
const UF_TO_STATE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_TO_UF).map(([name, uf]) => [uf, name])
)

function getColor(views: number, maxViews: number): string {
  if (views === 0 || maxViews === 0) return '#e5e7eb'
  const intensity = Math.min(views / maxViews, 1)
  // From light blue to deep blue
  const r = Math.round(219 - intensity * 160)
  const g = Math.round(234 - intensity * 140)
  const b = Math.round(254 - intensity * 50)
  return `rgb(${r}, ${g}, ${b})`
}

export function BrazilMap({ data, loading }: BrazilMapProps) {
  const [tooltip, setTooltip] = useState<{ name: string; views: number } | null>(null)

  // Build lookup: state name → data (handles both full name and UF)
  const lookup = useMemo(() => {
    const map = new Map<string, GeoData>()
    for (const d of data) {
      // Store by full name
      map.set(d.region, d)
      // Also store by UF if it's a full name
      const uf = STATE_TO_UF[d.region]
      if (uf) map.set(uf, d)
      // Also store by full name if it's a UF
      const fullName = UF_TO_STATE[d.region]
      if (fullName) map.set(fullName, d)
    }
    return map
  }, [data])

  const maxViews = useMemo(() => {
    return data.reduce((max, d) => Math.max(max, d.views), 0)
  }, [data])

  const topStates = useMemo(() => {
    return [...data].sort((a, b) => b.views - a.views).slice(0, 5)
  }, [data])

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-slate-50">
        Acessos por estado
      </h3>

      {!loading && data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">
          Nenhum dado geográfico no período
        </p>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="relative flex-1">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 600, center: [-54, -15] }}
              width={500}
              height={480}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name as string
                    const sigla = geo.properties.sigla as string
                    const stateData = lookup.get(stateName) || lookup.get(sigla)
                    const views = stateData?.views ?? 0

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(views, maxViews)}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: '#93c5fd', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => setTooltip({ name: stateName, views })}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>

            {tooltip && (
              <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-md dark:border-slate-600 dark:bg-slate-800">
                <span className="font-medium text-gray-900 dark:text-slate-50">{tooltip.name}</span>
                <span className="ml-2 text-gray-500 dark:text-slate-400">
                  {tooltip.views.toLocaleString('pt-BR')} visitas
                </span>
              </div>
            )}
          </div>

          {topStates.length > 0 && (
            <div className="lg:w-48">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Top estados
              </p>
              <div className="space-y-2">
                {topStates.map((s, i) => {
                  const uf = STATE_TO_UF[s.region] || s.region
                  return (
                    <div key={s.region} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-slate-300">
                        <span className="mr-1.5 text-gray-400 dark:text-slate-500">{i + 1}.</span>
                        {uf}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-slate-50">
                        {s.views.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
