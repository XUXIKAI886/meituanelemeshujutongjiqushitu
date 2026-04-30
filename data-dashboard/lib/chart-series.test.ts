import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPlatformMetricSeries, calculateSeriesAverage } from './chart-series.ts';

const combinedData = [
  {
    date: '2026-04-01',
    meituan: {
      cancellations: 6,
      commissionStores: 200,
      totalRevenue: 1200,
    },
    eleme: {
      cancellations: 0,
      commissionStores: 0,
      totalRevenue: 0,
    },
  },
  {
    date: '2026-04-02',
    meituan: {
      cancellations: 0,
      commissionStores: 180,
      totalRevenue: 1100,
    },
    eleme: {
      cancellations: 3,
      commissionStores: 90,
      totalRevenue: 500,
    },
  },
  {
    date: '2026-04-03',
    meituan: {
      cancellations: 0,
      commissionStores: 0,
      totalRevenue: 0,
    },
    eleme: {
      cancellations: 2,
      commissionStores: 88,
      totalRevenue: 480,
    },
  },
];

test('构建平台图表序列时排除补零日期，但保留真实 0 值', () => {
  const meituanSeries = buildPlatformMetricSeries(combinedData, 'meituan', 'cancellations');

  assert.deepEqual(
    meituanSeries.map((item) => ({ fullDate: item.fullDate, value: item.value })),
    [
      { fullDate: '2026-04-01', value: 6 },
      { fullDate: '2026-04-02', value: 0 },
    ]
  );
});

test('平均值只根据有效数据点计算，不把补零日期算进去', () => {
  const elemeSeries = buildPlatformMetricSeries(combinedData, 'eleme', 'cancellations');

  assert.equal(calculateSeriesAverage(elemeSeries), 2.5);
});

test('跨年同月日的数据点要保留完整日期，避免图表提示和横轴混淆年份', () => {
  const crossYearSeries = buildPlatformMetricSeries(
    [
      {
        date: '2025-01-27',
        meituan: {
          cancellations: 0,
          commissionStores: 11,
          totalRevenue: 299.92,
        },
        eleme: {
          cancellations: 0,
          commissionStores: 0,
          totalRevenue: 0,
        },
      },
      {
        date: '2026-01-27',
        meituan: {
          cancellations: 1,
          commissionStores: 233,
          totalRevenue: 2213.87,
        },
        eleme: {
          cancellations: 0,
          commissionStores: 0,
          totalRevenue: 0,
        },
      },
    ],
    'meituan',
    'totalRevenue'
  );

  assert.deepEqual(
    crossYearSeries.map((item) => ({
      date: item.date,
      fullDate: item.fullDate,
      value: item.value,
    })),
    [
      { date: '2025-01-27', fullDate: '2025-01-27', value: 299.92 },
      { date: '2026-01-27', fullDate: '2026-01-27', value: 2213.87 },
    ]
  );
});
