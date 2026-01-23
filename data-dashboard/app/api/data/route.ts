import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { join } from 'path';
import { DailyData, PlatformData } from '@/lib/types';
import { existsSync, readFileSync, statSync } from 'fs';

export const dynamic = 'force-dynamic';

/**
 * 获取文件最后修改时间（毫秒），不存在则返回 -1
 */
function getMtimeMs(filePath: string): number {
  try {
    return statSync(filePath).mtimeMs;
  } catch {
    return -1;
  }
}

/**
 * 在多个候选路径中选择“最新”的数据文件
 * - 支持从仓库根目录（当前目录）读取
 * - 兼容原有的 public/data 路径
 */
function resolveLatestExcelPath(fileName: string): string {
  const cwd = process.cwd();
  const candidates = [
    join(cwd, fileName),
    join(cwd, 'public', 'data', fileName),
    join(cwd, '..', fileName),
    join(cwd, '..', 'public', 'data', fileName),
    join(cwd, 'data-dashboard', 'public', 'data', fileName),
  ].filter((p, idx, arr) => arr.indexOf(p) === idx);

  const existing = candidates
    .filter((p) => existsSync(p))
    .map((p) => ({ path: p, mtimeMs: getMtimeMs(p) }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (existing.length === 0) {
    throw new Error(`未找到数据文件：${fileName}`);
  }

  return existing[0].path;
}

/**
 * 读取并解析Excel文件
 */
function parseExcelFile(filePath: string, platform: '美团' | '饿了么'): DailyData[] {
  try {
    const fileBuffer = readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet);

    return jsonData
      .map((row) => {
        // 处理日期格式 - Excel日期可能是序列号或字符串
        let dateStr = '';
        if (row['日期']) {
          const dateValue = row['日期'];
          if (typeof dateValue === 'number') {
            // Excel日期序列号转换
            const date = xlsx.SSF.parse_date_code(dateValue);
            dateStr = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
          } else {
            dateStr = String(dateValue);
          }
        }

        // 根据平台使用不同的列名映射
        let cancellations = 0;
        let commissionStores = 0;
        let totalRevenue = 0;

        if (platform === '美团') {
          cancellations = Number(row['美团解约店铺数'] || 0);
          commissionStores = Number(row['美团总抽点店铺数'] || 0);
          totalRevenue = Number(row['美团总金额'] || 0);
        } else if (platform === '饿了么') {
          cancellations = Number(row['饿了么解约店铺数'] || 0);
          commissionStores = Number(row['饿了么总店铺数'] || 0);
          totalRevenue = Number(row['饿了么总代运营结算金额'] || 0);
        }

        return {
          date: dateStr,
          cancellations,
          commissionStores,
          totalRevenue,
        };
      })
      .filter((item) => item.date);
  } catch (error) {
    console.error(`读取${platform}数据失败:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const meituanPath = resolveLatestExcelPath('美团数据.xlsx');
    const elemePath = resolveLatestExcelPath('饿了么数据.xlsx');

    const meituanData = parseExcelFile(meituanPath, '美团');
    const elemeData = parseExcelFile(elemePath, '饿了么');

    const response: PlatformData[] = [
      {
        platform: '美团',
        data: meituanData,
      },
      {
        platform: '饿了么',
        data: elemeData,
      },
    ];

    return NextResponse.json(response);
  } catch (error) {
    console.error('数据接口读取失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '读取数据文件失败' },
      { status: 500 }
    );
  }
}
