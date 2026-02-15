import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card } from '../../ui/Card'
import type { ViewByDay } from '../../../types'

interface ViewsChartProps {
  data: ViewByDay[]
  loading: boolean
}

function formatDate(day: string) {
  const d = new Date(day + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function ViewsChart({ data, loading }: ViewsChartProps) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-slate-50">
        Evolução de Visitas
      </h3>
      {!loading && data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">
          Nenhum dado no período selecionado
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={(label) => formatDate(label as string)}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="views"
              name="Visitas"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={data.length <= 31}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="unique_views"
              name="Únicos"
              stroke="#10b981"
              strokeWidth={2}
              dot={data.length <= 31}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
