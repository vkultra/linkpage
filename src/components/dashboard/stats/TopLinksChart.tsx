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
import type { TopLink } from '../../../types'

interface TopLinksChartProps {
  data: TopLink[]
  loading: boolean
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '...' : text
}

export function TopLinksChart({ data, loading }: TopLinksChartProps) {
  const chartData = data.map((d) => ({ ...d, shortTitle: truncate(d.title, 25) }))

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-slate-50">
        Links mais clicados
      </h3>
      {!loading && data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">
          Nenhum clique no período
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortTitle"
              width={140}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={(_label, payload) => {
                const item = payload?.[0]?.payload as TopLink | undefined
                return item?.title ?? ''
              }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="clicks" name="Cliques" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
