'use client';

import { useEffect, useState } from 'react';
import { DailyData, PlatformData } from '@/lib/types';
import { combinePlatformData, calculateStats } from '@/lib/data-utils';
import { StatsCards } from '@/components/stats-cards';
import { DataTable } from '@/components/data-table';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  CancellationsChart,
  CommissionStoresChart,
  RevenueChart,
} from '@/components/charts';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meituanData, setMeituanData] = useState<DailyData[]>([]);
  const [elemeData, setElemeData] = useState<DailyData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'table'>('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 使用静态 JSON 文件，支持 GitHub Pages 部署
        const basePath = process.env.NODE_ENV === 'production' ? '/meituanelemeshujutongjiqushitu' : '';
        const response = await fetch(`${basePath}/data/platform-data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: PlatformData[] = await response.json();

        const meituan = data.find((d) => d.platform === '美团');
        const eleme = data.find((d) => d.platform === '饿了么');

        setMeituanData(meituan?.data || []);
        setElemeData(eleme?.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos noise-overlay flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
          {/* 加载动画 */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[hsl(var(--eleme))] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[hsl(var(--meituan))] animate-spin-slow"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[hsla(var(--eleme),0.2)] to-[hsla(var(--meituan),0.2)]"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground/90">数据加载中</p>
            <p className="text-sm text-foreground/50 mt-1">正在获取最新数据...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cosmos noise-overlay flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 border-red-500/30">
          <div className="flex items-center gap-3 text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">加载失败: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  const combinedData = combinePlatformData(meituanData, elemeData);
  const meituanStats = calculateStats(meituanData);
  const elemeStats = calculateStats(elemeData);

  // 计算总计
  const totalRevenue = meituanStats.totalRevenue + elemeStats.totalRevenue;
  const totalCancellations = meituanStats.totalCancellations + elemeStats.totalCancellations;
  const totalStores = meituanStats.totalCommissionStores + elemeStats.totalCommissionStores;

  return (
    <main className="min-h-screen bg-cosmos noise-overlay">
      {/* 顶部导航栏 - 更简洁的设计 */}
      <header className="sticky top-0 z-50 border-b border-foreground/5 bg-[var(--header-bg)] backdrop-blur-xl transition-colors">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo & 标题 */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(var(--meituan))] to-[hsl(var(--eleme))] opacity-90"></div>
              <svg className="absolute inset-0 w-full h-full p-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 14l4-4 4 4 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-base sm:text-lg text-foreground tracking-tight">
                数据分析平台
              </h1>
              <p className="text-[10px] sm:text-xs text-foreground/40 -mt-0.5">美团 & 饿了么</p>
            </div>
          </div>

          {/* 中间 Tab 导航 */}
          <nav className="flex items-center gap-1 bg-foreground/5 rounded-full p-1">
            {[
              { key: 'overview', label: '概览' },
              { key: 'charts', label: '趋势' },
              { key: 'table', label: '明细' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all ${
                  activeTab === tab.key
                    ? 'bg-foreground/10 text-foreground shadow-sm'
                    : 'text-foreground/50 hover:text-foreground/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm">
              <div className="status-indicator pulse"></div>
              <span className="text-foreground/50">实时</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 主内容区 - Bento Grid 布局 */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 概览视图 */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            {/* 顶部总览卡片 - Bento Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* 总回款 - 大卡片 */}
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

              {/* 解约店铺 */}
              <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full"></div>
                <p className="text-xs text-foreground/50 mb-1">解约店铺</p>
                <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">{totalCancellations}</p>
                <p className="text-[10px] sm:text-xs text-foreground/40 mt-1">
                  美团 {meituanStats.totalCancellations} / 饿了么 {elemeStats.totalCancellations}
                </p>
              </div>

              {/* 抽点店铺 */}
              <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full"></div>
                <p className="text-xs text-foreground/50 mb-1">抽点店铺</p>
                <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">{totalStores}</p>
                <p className="text-[10px] sm:text-xs text-foreground/40 mt-1">
                  美团 {meituanStats.totalCommissionStores} / 饿了么 {elemeStats.totalCommissionStores}
                </p>
              </div>
            </div>

            {/* 平台详细数据卡片 */}
            <StatsCards meituanData={meituanData} elemeData={elemeData} />

            {/* 快速预览图表 */}
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base sm:text-lg text-foreground">回款趋势</h3>
                <button
                  onClick={() => setActiveTab('charts')}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors"
                >
                  查看全部 →
                </button>
              </div>
              <RevenueChart data={combinedData} />
            </div>
          </div>
        )}

        {/* 趋势视图 */}
        {activeTab === 'charts' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            <CancellationsChart data={combinedData} />
            <CommissionStoresChart data={combinedData} />
            <RevenueChart data={combinedData} />
          </div>
        )}

        {/* 明细视图 */}
        {activeTab === 'table' && (
          <div className="animate-fade-in-up">
            <DataTable data={combinedData} />
          </div>
        )}
      </div>

      {/* 底部 */}
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
