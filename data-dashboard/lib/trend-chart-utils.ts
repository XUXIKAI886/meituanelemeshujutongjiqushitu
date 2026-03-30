import { CombinedDailyData } from './types';

export type TrendMetricKey = 'cancellations' | 'commissionStores' | 'totalRevenue';

export interface CombinedMetricPoint {
  date: string;
  meituan: number;
  eleme: number;
  total: number;
}

export function buildCombinedMetricSeries(
  data: CombinedDailyData[],
  metric: TrendMetricKey
): CombinedMetricPoint[] {
  return data.map((item) => {
    const meituan = item.meituan[metric];
    const eleme = item.eleme[metric];

    return {
      date: item.date.slice(5),
      meituan,
      eleme,
      total: meituan + eleme,
    };
  });
}
