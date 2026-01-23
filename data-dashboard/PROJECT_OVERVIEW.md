# 项目概览

## 项目信息

**项目名称**: 美团 & 饿了么数据分析平台
**版本**: 1.0.0
**开发框架**: Next.js 16 + TypeScript
**UI框架**: Tailwind CSS + shadcn/ui

## 核心功能模块

### 1. 数据采集与解析
- **位置**: `app/api/data/route.ts`
- **功能**: 读取并解析 Excel 文件,转换为结构化数据
- **支持格式**: `.xlsx` (Excel 2007+)
- **数据字段**:
  - 日期 (Date)
  - 解约数 (Cancellations)
  - 抽点店铺数 (Commission Stores)
  - 回款总金额 (Total Revenue)

### 2. 数据统计与分析
- **位置**: `lib/data-utils.ts`
- **功能**:
  - 数据聚合与合并
  - 统计计算(总计、平均值)
  - 日期对齐与排序
- **关键函数**:
  - `combinePlatformData()`: 合并两平台数据
  - `calculateStats()`: 计算统计指标
  - `formatCurrency()`: 货币格式化
  - `formatNumber()`: 数字格式化

### 3. 数据可视化
- **位置**: `components/charts.tsx`
- **图表类型**:
  - 解约数趋势折线图
  - 抽点店铺数趋势折线图
  - 回款金额趋势折线图
- **特性**:
  - 响应式设计
  - 交互式 Tooltip
  - 双平台对比
  - 自定义配色(美团黄、饿了么蓝)

### 4. 数据表格展示
- **位置**: `components/data-table.tsx`
- **功能**:
  - 分栏展示两平台数据
  - 日期固定列
  - 横向滚动支持
  - 数据格式化显示

### 5. 统计卡片
- **位置**: `components/stats-cards.tsx`
- **显示内容**:
  - 总解约数
  - 总抽点店铺数
  - 总回款金额
  - 日均数据
- **布局**: 响应式网格,移动端自动调整

## 技术架构

### 前端技术栈

```
┌─────────────────────────────────────┐
│          Next.js App Router         │
├─────────────────────────────────────┤
│  React 19 + TypeScript 5            │
├─────────────────────────────────────┤
│  Tailwind CSS 4 + shadcn/ui         │
├─────────────────────────────────────┤
│  Recharts (可视化)                   │
│  xlsx (Excel解析)                    │
│  Lucide React (图标)                 │
└─────────────────────────────────────┘
```

### 项目结构

```
data-dashboard/
│
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   └── data/
│   │       └── route.ts      # 数据读取API
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
│
├── components/               # React 组件
│   ├── ui/                   # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── table.tsx
│   ├── charts.tsx            # 图表组件
│   ├── data-table.tsx        # 数据表格
│   └── stats-cards.tsx       # 统计卡片
│
├── lib/                      # 工具库
│   ├── data-utils.ts         # 数据处理
│   ├── types.ts              # 类型定义
│   └── utils.ts              # 通用工具
│
├── public/                   # 静态资源
│   └── data/                 # Excel 数据文件
│       ├── 美团数据.xlsx
│       └── 饿了么数据.xlsx
│
├── components.json           # shadcn/ui 配置
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
├── tailwind.config.ts        # Tailwind 配置
└── next.config.ts            # Next.js 配置
```

## 数据流程

```
Excel 文件
    ↓
API Route (解析)
    ↓
数据处理 (合并、排序)
    ↓
React 状态管理
    ↓
┌────────────┬────────────┬────────────┐
│  统计卡片   │   图表     │   表格     │
└────────────┴────────────┴────────────┘
```

## 类型定义

### DailyData
```typescript
interface DailyData {
  date: string;              // 日期
  cancellations: number;     // 解约数
  commissionStores: number;  // 抽点店铺数
  totalRevenue: number;      // 回款总金额
}
```

### PlatformData
```typescript
interface PlatformData {
  platform: '美团' | '饿了么';
  data: DailyData[];
}
```

### CombinedDailyData
```typescript
interface CombinedDailyData {
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
```

## 设计原则

### 1. 单一职责原则 (SRP)
- 每个组件专注于单一功能
- 数据处理与UI展示分离
- API逻辑独立于业务逻辑

### 2. 开闭原则 (OCP)
- 通过类型定义扩展数据字段
- 组件通过 props 配置行为
- 样式通过 Tailwind 类名灵活调整

### 3. DRY (Don't Repeat Yourself)
- 统一的数据格式化函数
- 可复用的 UI 组件
- 共享的类型定义

### 4. KISS (Keep It Simple, Stupid)
- 直观的文件结构
- 清晰的命名规范
- 简洁的业务逻辑

## 性能优化

### 1. 客户端优化
- React 18 自动批处理
- 组件懒加载
- 图表按需渲染

### 2. 服务端优化
- API 路由动态渲染 (`force-dynamic`)
- Excel 文件服务端解析
- 减少客户端计算负担

### 3. 构建优化
- TypeScript 严格模式
- Tree Shaking 自动移除未使用代码
- Next.js 自动代码分割

### 4. 网络优化
- 静态资源 CDN 分发 (Vercel)
- Brotli/Gzip 压缩
- HTTP/2 多路复用

## 响应式设计

### 断点设置
- **sm**: 640px (手机横屏)
- **md**: 768px (平板)
- **lg**: 1024px (桌面)
- **xl**: 1280px (大屏)

### 布局适配
- 移动端: 单列布局
- 平板: 双列布局
- 桌面: 三列布局

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 依赖版本

```json
{
  "next": "^16.0.3",
  "react": "^19.0.0",
  "typescript": "^5.7.2",
  "tailwindcss": "^4.0.0",
  "recharts": "^2.15.0",
  "xlsx": "^0.18.5"
}
```

## 开发规范

### 代码风格
- ESLint + Prettier
- 2空格缩进
- 单引号字符串
- 尾随逗号

### 命名规范
- 组件: PascalCase (e.g., `DataTable`)
- 函数: camelCase (e.g., `formatCurrency`)
- 常量: UPPER_SNAKE_CASE
- 文件: kebab-case (e.g., `data-utils.ts`)

### Git 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- perf: 性能优化
- test: 测试
- chore: 构建/工具

## 未来扩展方向

1. **数据导出**
   - PDF 报告生成
   - Excel 导出
   - CSV 下载

2. **高级分析**
   - 同比/环比分析
   - 预测趋势
   - 异常检测

3. **用户管理**
   - 多用户支持
   - 权限控制
   - 数据隔离

4. **实时更新**
   - WebSocket 推送
   - 自动刷新
   - 变更通知

5. **多平台支持**
   - 添加更多外卖平台
   - 跨平台对比
   - 市场份额分析

## 维护说明

### 日常维护
- 定期更新依赖包
- 监控性能指标
- 备份数据文件

### 问题排查
1. 检查浏览器控制台
2. 查看服务器日志
3. 验证数据文件格式
4. 测试 API 端点

### 联系方式
- GitHub Issues: 项目问题反馈
- 文档: README.md
- 部署指南: DEPLOYMENT.md
