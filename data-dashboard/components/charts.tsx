'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatCurrency, formatNumber } from '@/lib/data-utils';
import { buildCombinedMetricSeries, TrendMetricKey } from '@/lib/trend-chart-utils';
import { CombinedDailyData } from '@/lib/types';

interface TrendChartsProps {
  data: CombinedDailyData[];
}

interface TooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ value: number; dataKey: string }>;
  valueFormatter: (value: number) => string;
}

const chartConfigs: Array<{
  key: TrendMetricKey;
  title: string;
  subtitle: string;
  valueFormatter: (value: number) => string;
  tickFormatter?: (value: number) => string;
}> = [
  {
    key: 'cancellations',
    title: '解约趋势',
    subtitle: '双平台每日解约量对比',
    valueFormatter: formatNumber,
  },
  {
    key: 'commissionStores',
    title: '抽点店铺趋势',
    subtitle: '双平台每日抽点店铺变化',
    valueFormatter: formatNumber,
  },
  {
    key: 'totalRevenue',
    title: '回款趋势',
    subtitle: '双平台每日回款金额走势',
    valueFormatter: formatCurrency,
    tickFormatter: (value) => `${(value / 1000).toFixed(0)}k`,
  },
];

function TrendTooltip({ active, label, payload, valueFormatter }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const metricMap = Object.fromEntries(payload.map((item) => [item.dataKey, item.value]));

  return (
    <div className="glass-card rounded-xl px-4 py-3 border border-foreground/10 shadow-xl min-w-[180px]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">{label}</p>
      <div className="space-y-2 text-sm">
        <TooltipRow label="美团" value={valueFormatter(metricMap.meituan ?? 0)} color="bg-[hsl(var(--meituan))]" />
        <TooltipRow label="饿了么" value={valueFormatter(metricMap.eleme ?? 0)} color="bg-[hsl(var(--eleme))]" />
        <TooltipRow label="合计" value={valueFormatter(metricMap.total ?? 0)} color="bg-foreground/60" />
      </div>
    </div>
  );
}

function TooltipRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <span className="text-foreground/60">{label}</span>
      </div>
      <span className="font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}

function TrendChartCard({
  chartKey,
  title,
  subtitle,
  data,
  valueFormatter,
  tickFormatter,
}: {
  chartKey: TrendMetricKey;
  title: string;
  subtitle: string;
  data: CombinedDailyData[];
  valueFormatter: (value: number) => string;
  tickFormatter?: (value: number) => string;
}) {
  const chartData = buildCombinedMetricSeries(data, chartKey);

  return (
    <section id={chartKey} className="glass-card rounded-[28px] p-4 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/35 mb-2">Trend View</p>
          <h2 className="font-display text-xl sm:text-2xl text-foreground">{title}</h2>
          <p className="text-sm text-foreground/50 mt-1">{subtitle}</p>
        </div>
        <div className="text-xs text-foreground/45">单图并列展示美团与饿了么，灰色面积为双平台合计</div>
      </div>

      <div className="h-[300px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 16, right: 16, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={`${chartKey}-total`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsla(220, 10%, 70%, 0.32)" />
                <stop offset="100%" stopColor="hsla(220, 10%, 70%, 0)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
            />
            <Tooltip content={<TrendTooltip valueFormatter={valueFormatter} />} />
            <Legend wrapperStyle={{ paddingTop: 18, fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="total"
              name="双平台合计"
              fill={`url(#${chartKey}-total)`}
              stroke="hsl(var(--foreground))"
              strokeOpacity={0.18}
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="meituan"
              name="美团"
              stroke="hsl(var(--meituan))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: 'hsl(var(--meituan))', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="eleme"
              name="饿了么"
              stroke="hsl(var(--eleme))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: 'hsl(var(--eleme))', strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function TrendCharts({ data }: TrendChartsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {chartConfigs.map((config) => (
        <TrendChartCard
          key={config.key}
          chartKey={config.key}
          title={config.title}
          subtitle={config.subtitle}
          data={data}
          valueFormatter={config.valueFormatter}
          tickFormatter={config.tickFormatter}
        />
      ))}
    </div>
  );
}
