'use client';

import Link from 'next/link';
import { useState } from 'react';

import { DataTable } from '@/components/data-table';
import { ErrorState, LoadingState } from '@/components/page-state';
import { StatsCards } from '@/components/stats-cards';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePlatformData } from '@/hooks/use-platform-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'table'>('overview');
  const {
    loading,
    error,
    combinedData,
    meituanData,
    elemeData,
    meituanStats,
    elemeStats,
  } = usePlatformData();

  if (loading) {
    return <LoadingState message="数据加载中" detail="正在获取最新数据..." />;
  }

  if (error) {
    return <ErrorState message="首页加载失败" detail={error} />;
  }

  const totalRevenue = meituanStats.totalRevenue + elemeStats.totalRevenue;
  const totalCancellations = meituanStats.totalCancellations + elemeStats.totalCancellations;
  const totalStores = meituanStats.totalCommissionStores + elemeStats.totalCommissionStores;
  const latestDate = combinedData.at(-1)?.date ?? '--';

  return (
    <main className="min-h-screen bg-cosmos noise-overlay">
      <header className="sticky top-0 z-50 border-b border-foreground/5 bg-[var(--header-bg)] backdrop-blur-xl transition-colors">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(var(--meituan))] to-[hsl(var(--eleme))] opacity-90"></div>
              <svg className="absolute inset-0 w-full h-full p-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 14l4-4 4 4 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-base sm:text-lg text-foreground tracking-tight">数据分析平台</h1>
              <p className="text-[10px] sm:text-xs text-foreground/40 -mt-0.5">美团 & 饿了么</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-foreground/5 rounded-full p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all ${
                activeTab === 'overview'
                  ? 'bg-foreground/10 text-foreground shadow-sm'
                  : 'text-foreground/50 hover:text-foreground/70'
              }`}
            >
              概览
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all ${
                activeTab === 'table'
                  ? 'bg-foreground/10 text-foreground shadow-sm'
                  : 'text-foreground/50 hover:text-foreground/70'
              }`}
            >
              明细
            </button>
            <Link
              href="/trends"
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full text-foreground/50 hover:text-foreground/80 transition-colors"
            >
              趋势页
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm">
              <div className="status-indicator pulse"></div>
              <span className="text-foreground/50">更新至 {latestDate}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="col-span-2 glass-card glass-card-hover rounded-2xl p-4 sm:p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--meituan),0.1)] via-transparent to-[hsla(var(--eleme),0.1)] opacity-50"></div>
                <div className="relative">
                  <p className="text-xs sm:text-sm text-foreground/50 mb-1">总回款金额</p>
                  <p className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[hsl(var(--meituan))] to-[hsl(var(--eleme))] bg-clip-text text-transparent">
                    ¥{(totalRevenue / 10000).toFixed(2)}万
                  </p>
                  <div className="flex items-center gap-4 mt-3 sm:mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--meituan))]"></span>
                      <span className="text-xs text-foreground/50">美团 ¥{(meituanStats.totalRevenue / 10000).toFixed(1)}万</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--eleme))]"></span>
                      <span className="text-xs text-foreground/50">饿了么 ¥{(elemeStats.totalRevenue / 10000).toFixed(1)}万</span>
                    </div>
                  </div>
                </div>
              </div>

              <MetricCard label="解约店铺" value={totalCancellations} detail={`美团 ${meituanStats.totalCancellations} / 饿了么 ${elemeStats.totalCancellations}`} accent="from-red-500/10" />
              <MetricCard label="抽点店铺" value={totalStores} detail={`美团 ${meituanStats.totalCommissionStores} / 饿了么 ${elemeStats.totalCommissionStores}`} accent="from-green-500/10" />
            </div>

            <StatsCards meituanData={meituanData} elemeData={elemeData} />

            <Link
              href="/trends"
              className="glass-card glass-card-hover rounded-[28px] p-5 sm:p-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between group"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/35 mb-2">Separate Trend Page</p>
                <h2 className="font-display text-xl sm:text-2xl text-foreground">进入双平台合并趋势页</h2>
                <p className="text-sm text-foreground/50 mt-2 max-w-2xl">
                  趋势已经从首页拆出，三类指标统一用同一坐标系展示美团与饿了么，方便直接比较节奏差异和整体抬升。
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm min-w-full lg:min-w-[360px]">
                <MiniStat label="最新日期" value={latestDate} />
                <MiniStat label="趋势天数" value={`${combinedData.length}`} />
                <MiniStat label="总回款" value={`¥${(totalRevenue / 10000).toFixed(2)}万`} />
              </div>
            </Link>
          </div>
        )}

        {activeTab === 'table' && (
          <div className="animate-fade-in-up">
            <DataTable data={combinedData} />
          </div>
        )}
      </div>

      <footer className="border-t border-foreground/5 py-6 transition-colors">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between text-sm text-foreground/30">
          <p>数据分析平台 v1.0</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-meituan">美团</span>
            <span>&</span>
            <span className="text-eleme">饿了么</span>
            <span>数据</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: number;
  detail: string;
  accent: string;
}) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${accent} to-transparent rounded-bl-full`}></div>
      <p className="text-xs text-foreground/50 mb-1">{label}</p>
      <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[10px] sm:text-xs text-foreground/40 mt-1">{detail}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.03] px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/35">{label}</p>
      <p className="font-mono text-sm sm:text-base text-foreground mt-2">{value}</p>
    </div>
  );
}
