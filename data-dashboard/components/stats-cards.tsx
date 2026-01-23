'use client';

import { DailyData } from '@/lib/types';
import { calculateStats, formatCurrency, formatNumber } from '@/lib/data-utils';

interface StatsCardsProps {
  meituanData: DailyData[];
  elemeData: DailyData[];
}

export function StatsCards({ meituanData, elemeData }: StatsCardsProps) {
  const meituanStats = calculateStats(meituanData);
  const elemeStats = calculateStats(elemeData);

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      {/* 美团区块 - 更紧凑的设计 */}
      <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--meituan),0.08)] to-transparent"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[hsla(var(--meituan),0.1)] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

        <div className="relative">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[hsl(var(--meituan))] to-[hsl(38,100%,40%)] flex items-center justify-center shadow-lg shadow-[hsla(var(--meituan),0.3)]">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base text-meituan">美团</h3>
                <p className="text-[10px] sm:text-xs text-foreground/40">Meituan</p>
              </div>
            </div>
            <span className="badge badge-meituan text-[10px]">
              {meituanData.length} 天
            </span>
          </div>

          {/* 指标网格 */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <MetricItem
              label="解约"
              value={formatNumber(meituanStats.totalCancellations)}
              subValue={`均 ${formatNumber(meituanStats.avgCancellations)}`}
              platform="meituan"
            />
            <MetricItem
              label="抽点"
              value={formatNumber(meituanStats.totalCommissionStores)}
              subValue={`均 ${formatNumber(meituanStats.avgCommissionStores)}`}
              platform="meituan"
            />
            <MetricItem
              label="回款"
              value={formatCurrency(meituanStats.totalRevenue)}
              subValue={`均 ${formatCurrency(meituanStats.avgRevenue)}`}
              platform="meituan"
              isLarge
            />
          </div>
        </div>
      </div>

      {/* 饿了么区块 - 更紧凑的设计 */}
      <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--eleme),0.08)] to-transparent"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[hsla(var(--eleme),0.1)] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

        <div className="relative">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[hsl(var(--eleme))] to-[hsl(210,80%,40%)] flex items-center justify-center shadow-lg shadow-[hsla(var(--eleme),0.3)]">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base text-eleme">饿了么</h3>
                <p className="text-[10px] sm:text-xs text-foreground/40">Ele.me</p>
              </div>
            </div>
            <span className="badge badge-eleme text-[10px]">
              {elemeData.length} 天
            </span>
          </div>

          {/* 指标网格 */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <MetricItem
              label="解约"
              value={formatNumber(elemeStats.totalCancellations)}
              subValue={`均 ${formatNumber(elemeStats.avgCancellations)}`}
              platform="eleme"
            />
            <MetricItem
              label="抽点"
              value={formatNumber(elemeStats.totalCommissionStores)}
              subValue={`均 ${formatNumber(elemeStats.avgCommissionStores)}`}
              platform="eleme"
            />
            <MetricItem
              label="回款"
              value={formatCurrency(elemeStats.totalRevenue)}
              subValue={`均 ${formatCurrency(elemeStats.avgRevenue)}`}
              platform="eleme"
              isLarge
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
  subValue: string;
  platform: 'meituan' | 'eleme';
  isLarge?: boolean;
}

function MetricItem({ label, value, subValue, platform, isLarge }: MetricItemProps) {
  const valueColor = platform === 'meituan' ? 'text-meituan' : 'text-eleme';
  const bgColor = platform === 'meituan'
    ? 'bg-[hsla(var(--meituan),0.05)]'
    : 'bg-[hsla(var(--eleme),0.05)]';

  return (
    <div className={`rounded-lg p-2.5 sm:p-3 ${bgColor} border border-foreground/5`}>
      <p className="text-[10px] sm:text-xs font-medium text-foreground/50 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`font-mono font-semibold ${valueColor} ${isLarge ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
        {value}
      </p>
      <p className="text-[9px] sm:text-[10px] text-foreground/40 mt-0.5">
        {subValue}
      </p>
    </div>
  );
}
