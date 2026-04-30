import type { CombinedDailyData } from './types';

export type PlatformKey = 'meituan' | 'eleme';
export type MetricKey = 'cancellations' | 'commissionStores' | 'totalRevenue';

export interface ChartSeriesPoint {
  date: string;
  fullDate: string;
  value: number;
}

function hasPlatformData(item: CombinedDailyData, platform: PlatformKey): boolean {
  const platformData = item[platform];

  return (
    platformData.cancellations !== 0 ||
    platformData.commissionStores !== 0 ||
    platformData.totalRevenue !== 0
  );
}

/**
 * 为单个平台构建图表序列，过滤双平台日期对齐时补出来的全 0 数据。
 */
export function buildPlatformMetricSeries(
  data: CombinedDailyData[],
  platform: PlatformKey,
  metric: MetricKey
): ChartSeriesPoint[] {
  return data
    .filter((item) => hasPlatformData(item, platform))
    .map((item) => ({
      date: item.date,
      fullDate: item.date,
      value: item[platform][metric],
    }));
}

/**
 * 横轴显示使用短日期，但内部仍保留完整日期作为唯一键。
 */
export function formatChartAxisDateLabel(date: string): string {
  return date.length >= 10 ? date.substring(5) : date;
}

/**
 * 根据图表实际展示的数据点计算平均值。
 */
export function calculateSeriesAverage(series: ChartSeriesPoint[]): number {
  if (series.length === 0) {
    return 0;
  }

  const total = series.reduce((sum, item) => sum + item.value, 0);
  return total / series.length;
}
