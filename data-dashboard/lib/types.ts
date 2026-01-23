/**
 * 数据类型定义
 */

export interface DailyData {
  date: string; // 日期
  cancellations: number; // 解约数
  commissionStores: number; // 抽点店铺数
  totalRevenue: number; // 回款总金额
}

export interface PlatformData {
  platform: '美团' | '饿了么';
  data: DailyData[];
}

export interface CombinedDailyData {
  date: string;
  meituan: {
    cancellations: number;
    commissionStores: number;
    totalRevenue: number;
  };
  eleme: {
    cancellations: number;
    commissionStores: number;
    totalRevenue: number;
  };
}
