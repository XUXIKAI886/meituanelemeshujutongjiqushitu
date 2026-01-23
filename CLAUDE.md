# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个美团&饿了么每日解约数据分析平台,包含:
- **根目录**: 存放原始 Excel 数据文件(`美团数据.xlsx`, `饿了么数据.xlsx`)
- **data-dashboard/**: Next.js 数据可视化 Web 应用

## 开发命令

在 `data-dashboard/` 目录下执行:

```bash
# 开发环境
npm run dev          # 启动开发服务器 (http://localhost:3000)

# 生产构建
npm run build        # 构建生产版本
npm start            # 启动生产服务器

# 代码检查
npm run lint         # 运行 ESLint
```

## 核心架构

### 数据流架构

1. **数据源**: Excel 文件位于 `data-dashboard/public/data/`
   - `美团数据.xlsx`: 列名为 `美团解约店铺数`、`美团总抽点店铺数`、`美团总金额`
   - `饿了么数据.xlsx`: 列名为 `饿了么解约店铺数`、`饿了么总店铺数`、`饿了么总代运营结算金额`

2. **API 层**: `app/api/data/route.ts`
   - 使用 `xlsx` 库读取 Excel 文件
   - 处理 Excel 日期序列号转换
   - 根据平台映射不同列名到统一数据结构
   - 返回标准化的 `PlatformData[]` 格式

3. **数据处理**: `lib/data-utils.ts`
   - `combinePlatformData()`: 按日期对齐两个平台的数据
   - `calculateStats()`: 计算总计和平均值
   - `formatCurrency()` / `formatNumber()`: 中文格式化

4. **UI 组件层**:
   - `page.tsx`: 主页面,客户端组件,通过 `fetch('/api/data')` 获取数据
   - `stats-cards.tsx`: 统计卡片(总计/平均值)
   - `charts.tsx`: 三类指标的双图表对比(解约数、抽点店铺数、回款金额)
   - `data-table.tsx`: 明细数据表格

### 类型系统 (`lib/types.ts`)

```typescript
DailyData           // 单个平台的单日数据
PlatformData        // 单个平台的全部数据
CombinedDailyData   // 两个平台按日期合并的数据
```

### shadcn/ui 配置

- 样式: `new-york` 风格
- 基础颜色: `neutral`
- 图标库: `lucide-react`
- 别名: `@/*` 映射到项目根目录

## 数据更新流程

1. 更新根目录的 Excel 文件(`美团数据.xlsx`, `饿了么数据.xlsx`)
2. 将更新后的文件复制到 `data-dashboard/public/data/`
3. 开发环境会自动刷新,生产环境需重新构建

## 关键注意事项

- **Excel 日期处理**: API 路由使用 `xlsx.SSF.parse_date_code()` 处理 Excel 日期序列号
- **列名映射**: 不同平台使用不同的 Excel 列名,在 `route.ts:37-45` 进行映射
- **响应式设计**: 使用 `lg:grid-cols-2` 实现桌面双列、移动单列布局
- **客户端渲染**: 主页面使用 `'use client'` 指令,因为需要状态管理和 React Hooks
- **API 缓存**: `route.ts` 使用 `export const dynamic = 'force-dynamic'` 禁用缓存
