'use client';

import { CombinedDailyData } from '@/lib/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/data-utils';

interface ChartsProps {
  data: CombinedDailyData[];
}

// 过滤美团数据，排除所有指标都为0的记录
function filterMeituanData(data: CombinedDailyData[]) {
  return data.filter((item) =>
    item.meituan.cancellations !== 0 ||
    item.meituan.commissionStores !== 0 ||
    item.meituan.totalRevenue !== 0
  );
}

// 自定义 Tooltip 组件 - 更紧凑的设计
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  platform: 'meituan' | 'eleme';
  valueFormatter?: (value: number) => string;
}

function CustomTooltip({ active, payload, label, platform, valueFormatter = formatNumber }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const accentColor = platform === 'meituan' ? 'bg-[hsl(var(--meituan))]' : 'bg-[hsl(var(--eleme))]';
  const textColor = platform === 'meituan' ? 'text-meituan' : 'text-eleme';

  return (
    <div className="glass-card rounded-lg px-3 py-2 border border-foreground/10 shadow-xl">
      <p className="text-[10px] text-foreground/50 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${accentColor}`}></span>
        <span className={`font-mono text-sm font-semibold ${textColor}`}>
          {valueFormatter(payload[0].value as number)}
        </span>
      </div>
    </div>
  );
}

// 图表容器组件 - 更紧凑的设计
interface ChartCardProps {
  title: string;
  subtitle: string;
  platform: 'meituan' | 'eleme';
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, platform, children }: ChartCardProps) {
  const dotColor = platform === 'meituan' ? 'bg-[hsl(var(--meituan))]' : 'bg-[hsl(var(--eleme))]';
  const titleColor = platform === 'meituan' ? 'text-meituan' : 'text-eleme';

  return (
    <div className="glass-card glass-card-hover rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        <h3 className={`font-display text-sm ${titleColor}`}>{title}</h3>
        <span className="text-[10px] text-foreground/40">· {subtitle}</span>
      </div>
      <div className="px-2 pb-3">
        {children}
      </div>
    </div>
  );
}

// 解约趋势图
export function CancellationsChart({ data }: ChartsProps) {
  const meituanChartData = filterMeituanData(data).map((item) => ({
    date: item.date.substring(5),
    value: item.meituan.cancellations,
  }));

  const elemeChartData = data.map((item) => ({
    date: item.date.substring(5),
    value: item.eleme.cancellations,
  }));

  // Calculate averages
  const meituanAverage = meituanChartData.length
    ? meituanChartData.reduce((sum, item) => sum + item.value, 0) / meituanChartData.length
    : 0;
  const elemeAverage = elemeChartData.length
    ? elemeChartData.reduce((sum, item) => sum + item.value, 0) / elemeChartData.length
    : 0;

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <ChartCard title="美团解约" subtitle="每日变化" platform="meituan">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={meituanChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="meituanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--meituan))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--meituan))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip platform="meituan" />} />
            <ReferenceLine 
              y={meituanAverage} 
              stroke="red" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ 
                value: formatNumber(Math.round(meituanAverage)), 
                position: 'right', 
                fill: 'red', 
                fontSize: 11,
                fontWeight: 600
              }}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--meituan))" strokeWidth={2} fill="url(#meituanGradient)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--meituan))', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="饿了么解约" subtitle="每日变化" platform="eleme">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={elemeChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elemeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--eleme))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--eleme))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip platform="eleme" />} />
            <ReferenceLine 
              y={elemeAverage} 
              stroke="red" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ 
                value: formatNumber(Math.round(elemeAverage)), 
                position: 'right', 
                fill: 'red', 
                fontSize: 11,
                fontWeight: 600
              }}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--eleme))" strokeWidth={2} fill="url(#elemeGradient)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--eleme))', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

// 抽点店铺趋势图
export function CommissionStoresChart({ data }: ChartsProps) {
  const meituanChartData = filterMeituanData(data).map((item) => ({
    date: item.date.substring(5),
    value: item.meituan.commissionStores,
  }));

  const elemeChartData = data.map((item) => ({
    date: item.date.substring(5),
    value: item.eleme.commissionStores,
  }));

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <ChartCard title="美团抽点" subtitle="每日变化" platform="meituan">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={meituanChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="meituanGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--meituan))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--meituan))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip platform="meituan" />} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--meituan))" strokeWidth={2} fill="url(#meituanGradient2)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--meituan))', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="饿了么抽点" subtitle="每日变化" platform="eleme">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={elemeChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elemeGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--eleme))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--eleme))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip platform="eleme" />} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--eleme))" strokeWidth={2} fill="url(#elemeGradient2)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--eleme))', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

// 回款金额趋势图
export function RevenueChart({ data }: ChartsProps) {
  const meituanChartData = filterMeituanData(data).map((item) => ({
    date: item.date.substring(5),
    value: item.meituan.totalRevenue,
  }));

  const elemeChartData = data.map((item) => ({
    date: item.date.substring(5),
    value: item.eleme.totalRevenue,
  }));

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <ChartCard title="美团回款" subtitle="每日变化" platform="meituan">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={meituanChartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="meituanGradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--meituan))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--meituan))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip platform="meituan" valueFormatter={formatCurrency} />} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--meituan))" strokeWidth={2} fill="url(#meituanGradient3)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--meituan))', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="饿了么回款" subtitle="每日变化" platform="eleme">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={elemeChartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="elemeGradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--eleme))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--eleme))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip platform="eleme" valueFormatter={formatCurrency} />} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--eleme))" strokeWidth={2} fill="url(#elemeGradient3)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--eleme))', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
