import { DailyData, CombinedDailyData } from './types';

/**
 * 合并两个平台的数据,按日期对齐
 */
export function combinePlatformData(
  meituanData: DailyData[],
  elemeData: DailyData[]
): CombinedDailyData[] {
  const dateMap = new Map<string, CombinedDailyData>();

  // 处理美团数据
  meituanData.forEach((item) => {
    if (!dateMap.has(item.date)) {
      dateMap.set(item.date, {
        date: item.date,
        meituan: {
          cancellations: item.cancellations,
          commissionStores: item.commissionStores,
          totalRevenue: item.totalRevenue,
        },
        eleme: {
          cancellations: 0,
          commissionStores: 0,
          totalRevenue: 0,
        },
      });
    } else {
      const existing = dateMap.get(item.date)!;
      existing.meituan = {
        cancellations: item.cancellations,
        commissionStores: item.commissionStores,
        totalRevenue: item.totalRevenue,
      };
    }
  });

  // 处理饿了么数据
  elemeData.forEach((item) => {
    if (!dateMap.has(item.date)) {
      dateMap.set(item.date, {
        date: item.date,
        meituan: {
          cancellations: 0,
          commissionStores: 0,
          totalRevenue: 0,
        },
        eleme: {
          cancellations: item.cancellations,
          commissionStores: item.commissionStores,
          totalRevenue: item.totalRevenue,
        },
      });
    } else {
      const existing = dateMap.get(item.date)!;
      existing.eleme = {
        cancellations: item.cancellations,
        commissionStores: item.commissionStores,
        totalRevenue: item.totalRevenue,
      };
    }
  });

  // 转换为数组并按日期排序
  return Array.from(dateMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

/**
 * 计算统计数据
 */
export function calculateStats(data: DailyData[]) {
  if (data.length === 0) {
    return {
      totalCancellations: 0,
      totalCommissionStores: 0,
      totalRevenue: 0,
      avgCancellations: 0,
      avgCommissionStores: 0,
      avgRevenue: 0,
    };
  }

  const total = data.reduce(
    (acc, item) => ({
      cancellations: acc.cancellations + item.cancellations,
      commissionStores: acc.commissionStores + item.commissionStores,
      totalRevenue: acc.totalRevenue + item.totalRevenue,
    }),
    { cancellations: 0, commissionStores: 0, totalRevenue: 0 }
  );

  return {
    totalCancellations: total.cancellations,
    totalCommissionStores: total.commissionStores,
    totalRevenue: total.totalRevenue,
    avgCancellations: Math.round(total.cancellations / data.length),
    avgCommissionStores: Math.round(total.commissionStores / data.length),
    avgRevenue: Math.round(total.totalRevenue / data.length),
  };
}

/**
 * 格式化金额显示
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * 格式化数字显示
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}
