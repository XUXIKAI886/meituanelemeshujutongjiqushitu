import test from 'node:test';
import assert from 'node:assert/strict';

import type { CombinedDailyData } from './types';
import { buildCombinedMetricSeries } from './trend-chart-utils';

const combinedData: CombinedDailyData[] = [
  {
    date: '2026-03-28',
    meituan: {
      cancellations: 3,
      commissionStores: 10,
      totalRevenue: 8000,
    },
    eleme: {
      cancellations: 1,
      commissionStores: 4,
      totalRevenue: 2600,
    },
  },
  {
    date: '2026-03-29',
    meituan: {
      cancellations: 5,
      commissionStores: 12,
      totalRevenue: 9200,
    },
    eleme: {
      cancellations: 2,
      commissionStores: 6,
      totalRevenue: 3100,
    },
  },
];

test('buildCombinedMetricSeries 返回双平台合并趋势数据', () => {
  const series = buildCombinedMetricSeries(combinedData, 'cancellations');

  assert.deepEqual(series, [
    {
      date: '03-28',
      meituan: 3,
      eleme: 1,
      total: 4,
    },
    {
      date: '03-29',
      meituan: 5,
      eleme: 2,
      total: 7,
    },
  ]);
});

test('buildCombinedMetricSeries 支持回款金额字段', () => {
  const series = buildCombinedMetricSeries(combinedData, 'totalRevenue');

  assert.deepEqual(series[1], {
    date: '03-29',
    meituan: 9200,
    eleme: 3100,
    total: 12300,
  });
});
