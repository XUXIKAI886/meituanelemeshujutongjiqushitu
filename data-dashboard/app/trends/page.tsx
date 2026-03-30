'use client';

import Link from 'next/link';

import { TrendCharts } from '@/components/charts';
import { ErrorState, LoadingState } from '@/components/page-state';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePlatformData } from '@/hooks/use-platform-data';

export default function TrendsPage() {
  const {
    loading,
    error,
    combinedData,
    meituanStats,
    elemeStats,
  } = usePlatformData();

  if (loading) {
    return <LoadingState message="趋势页加载中" detail="正在整理双平台趋势数据..." />;
  }

  if (error) {
    return <ErrorState message="趋势页加载失败" detail={error} />;
  }

  const totalRevenue = meituanStats.totalRevenue + elemeStats.totalRevenue;
  const totalCancellations = meituanStats.totalCancellations + elemeStats.totalCancellations;
  const totalStores = meituanStats.totalCommissionStores + elemeStats.totalCommissionStores;
  const latestDate = combinedData.at(-1)?.date ?? '--';
  const firstDate = combinedData[0]?.date ?? '--';

  return (
    <main className="min-h-screen bg-cosmos noise-overlay">
      <header className="sticky top-0 z-50 border-b border-foreground/5 bg-[var(--header-bg)] backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              aria-label="返回首页"
            >
              ←
            </Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/35">Trend Center</p>
              <h1 className="font-display text-lg text-foreground">双平台趋势页</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2 bg-foreground/5 rounded-full p-1">
            <a href="#cancellations" className="px-4 py-1.5 text-sm text-foreground/65 hover:text-foreground rounded-full transition-colors">解约</a>
            <a href="#commissionStores" className="px-4 py-1.5 text-sm text-foreground/65 hover:text-foreground rounded-full transition-colors">抽点</a>
            <a href="#totalRevenue" className="px-4 py-1.5 text-sm text-foreground/65 hover:text-foreground rounded-full transition-colors">回款</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-foreground/40">更新至 {latestDate}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
        <section className="glass-card rounded-[32px] p-5 sm:p-7 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(45,100%,50%,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,hsla(199,89%,48%,0.18),transparent_35%)] opacity-80"></div>
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/40 mb-3">Unified Trend Story</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight max-w-3xl">
                把美团与饿了么放进同一张图，直接看出节奏差异和总量抬升。
              </h2>
              <p className="text-sm sm:text-base text-foreground/55 mt-4 max-w-2xl">
                当前趋势页将两平台每日数据叠加到同一坐标系中。黄色是美团，蓝色是饿了么，灰色面积是双平台合计。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TrendStat label="时间范围" value={`${firstDate} 至 ${latestDate}`} tone="neutral" />
              <TrendStat label="覆盖天数" value={`${combinedData.length} 天`} tone="neutral" />
              <TrendStat label="累计解约" value={`${totalCancellations}`} tone="meituan" />
              <TrendStat label="累计抽点" value={`${totalStores}`} tone="eleme" />
              <div className="col-span-2">
                <TrendStat label="累计回款" value={`¥${(totalRevenue / 10000).toFixed(2)}万`} tone="mixed" />
              </div>
            </div>
          </div>
        </section>

        <TrendCharts data={combinedData} />
      </div>
    </main>
  );
}

function TrendStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'neutral' | 'meituan' | 'eleme' | 'mixed';
}) {
  const toneClassMap = {
    neutral: 'from-white/8 to-white/0',
    meituan: 'from-[hsla(var(--meituan),0.22)] to-transparent',
    eleme: 'from-[hsla(var(--eleme),0.22)] to-transparent',
    mixed: 'from-[hsla(var(--meituan),0.16)] via-[hsla(var(--eleme),0.14)] to-transparent',
  };

  return (
    <div className={`glass-card rounded-2xl p-4 h-full bg-gradient-to-br ${toneClassMap[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/35">{label}</p>
      <p className="mt-3 font-mono text-lg sm:text-xl text-foreground">{value}</p>
    </div>
  );
}
