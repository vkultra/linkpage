import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card } from '../../ui/Card'
import type { HourlyData } from '../../../types'

interface HourlyChartProps {
  data: HourlyData[]
  loading: boolean
}

// Fill missing hours with 0
function fillHours(data: HourlyData[]): HourlyData[] {
  const map = new Map(data.map((d) => [d.hour, d.views]))
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    views: map.get(i) ?? 0,
  }))
}

export function HourlyChart({ data, loading }: HourlyChartProps) {
  const filled = fillHours(data)

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-slate-50">
        Horários de acesso
      </h3>
      {!loading && data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">
          Nenhum dado no período
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={filled} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="hour"
              tickFormatter={(h: number) => `${h}h`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={(h) => `${h}:00 — ${h}:59`}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="views" name="Visitas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
