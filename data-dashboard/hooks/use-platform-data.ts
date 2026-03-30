'use client';

import { useEffect, useState } from 'react';

import { combinePlatformData, calculateStats } from '@/lib/data-utils';
import { DailyData, PlatformData } from '@/lib/types';

function getDataUrl() {
  const basePath = process.env.NODE_ENV === 'production'
    ? '/meituanelemeshujutongjiqushitu'
    : '';

  return `${basePath}/data/platform-data.json`;
}

export function usePlatformData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meituanData, setMeituanData] = useState<DailyData[]>([]);
  const [elemeData, setElemeData] = useState<DailyData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(getDataUrl());
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: PlatformData[] = await response.json();
        const meituan = data.find((item) => item.platform === '美团');
        const eleme = data.find((item) => item.platform === '饿了么');

        setMeituanData(meituan?.data ?? []);
        setElemeData(eleme?.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const combinedData = combinePlatformData(meituanData, elemeData);
  const meituanStats = calculateStats(meituanData);
  const elemeStats = calculateStats(elemeData);

  return {
    loading,
    error,
    meituanData,
    elemeData,
    combinedData,
    meituanStats,
    elemeStats,
  };
}
