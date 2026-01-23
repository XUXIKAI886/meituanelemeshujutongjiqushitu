'use client';

import { CombinedDailyData } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/data-utils';

interface DataTableProps {
  data: CombinedDailyData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* 表格头部 - 更紧凑 */}
      <div className="px-4 py-3 border-b border-foreground/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-sm sm:text-base text-foreground">数据明细</h3>
          <span className="text-[10px] sm:text-xs text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
            {data.length} 条
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[hsla(var(--meituan),0.3)]"></span>
            <span className="text-[10px] text-foreground/40">美团</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[hsla(var(--eleme),0.3)]"></span>
            <span className="text-[10px] text-foreground/40">饿了么</span>
          </div>
        </div>
      </div>

      {/* 表格内容 */}
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full data-table text-xs sm:text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-foreground/5">
              <th className="bg-[var(--table-header-bg)] px-3 py-2.5 text-left text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">
                日期
              </th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold text-meituan/70 uppercase tracking-wider bg-[hsla(var(--meituan),0.05)]">
                解约
              </th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold text-meituan/70 uppercase tracking-wider bg-[hsla(var(--meituan),0.05)]">
                抽点
              </th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold text-meituan/70 uppercase tracking-wider bg-[hsla(var(--meituan),0.05)]">
                回款
              </th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold text-eleme/70 uppercase tracking-wider bg-[hsla(var(--eleme),0.05)]">
                解约
              </th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold text-eleme/70 uppercase tracking-wider bg-[hsla(var(--eleme),0.05)]">
                抽点
              </th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold text-eleme/70 uppercase tracking-wider bg-[hsla(var(--eleme),0.05)]">
                回款
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-foreground/40 text-xs">暂无数据</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-3 py-2 font-mono text-xs text-foreground/70">{row.date}</td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-foreground/60 bg-[hsla(var(--meituan),0.02)]">
                    {formatNumber(row.meituan.cancellations)}
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-foreground/60 bg-[hsla(var(--meituan),0.02)]">
                    {formatNumber(row.meituan.commissionStores)}
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-meituan bg-[hsla(var(--meituan),0.02)]">
                    {formatCurrency(row.meituan.totalRevenue)}
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-foreground/60 bg-[hsla(var(--eleme),0.02)]">
                    {formatNumber(row.eleme.cancellations)}
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-foreground/60 bg-[hsla(var(--eleme),0.02)]">
                    {formatNumber(row.eleme.commissionStores)}
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-eleme bg-[hsla(var(--eleme),0.02)]">
                    {formatCurrency(row.eleme.totalRevenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
