# 美团 & 饿了么数据分析平台

一个基于 Next.js 的数据可视化平台,用于统计和分析美团、饿了么两个平台的每日运营数据。

## 功能特性

- 📊 **数据统计**: 展示每日解约数、抽点店铺数、回款总金额
- 📈 **趋势分析**: 三类关键指标的折线图可视化
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎨 **现代化UI**: 基于 shadcn/ui 的专业界面设计
- 📋 **数据表格**: 清晰展示两个平台的明细数据对比

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: [shadcn/ui](https://ui.shadcn.com/)
- **图标**: Lucide React
- **图表**: Recharts
- **配色系统**: Radix Colors
- **数据处理**: xlsx

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 准备数据文件

将Excel数据文件放置在 `public/data/` 目录下:
- `public/data/美团数据.xlsx`
- `public/data/饿了么数据.xlsx`

Excel文件格式要求:
| 日期 | 解约数 | 抽点店铺数 | 回款总金额 |
|------|--------|-----------|-----------|
| 2024-01-01 | 100 | 50 | 10000 |

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
data-dashboard/
├── app/
│   ├── api/
│   │   └── data/
│   │       └── route.ts          # 数据API路由
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── components/
│   ├── ui/                       # shadcn/ui 基础组件
│   ├── charts.tsx                # 图表组件
│   ├── data-table.tsx            # 数据表格组件
│   └── stats-cards.tsx           # 统计卡片组件
├── lib/
│   ├── data-utils.ts             # 数据处理工具
│   ├── types.ts                  # TypeScript 类型定义
│   └── utils.ts                  # 通用工具函数
└── public/
    └── data/                     # Excel数据文件目录
```

## 部署到 Vercel

1. 将项目推送到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com/) 并导入项目
3. 确保 `public/data/` 目录包含数据文件
4. 部署完成后即可访问

注意: Vercel 部署时需要确保数据文件正确上传,或者考虑使用环境变量配置外部数据源。

## 数据更新

要更新数据,只需替换 `public/data/` 目录下的Excel文件,然后重新构建项目。

如果是开发环境,保存文件后页面会自动刷新。

## 自定义配置

### 修改颜色主题

编辑 `app/globals.css` 中的 CSS 变量来自定义颜色。

### 添加新的数据指标

1. 更新 `lib/types.ts` 中的类型定义
2. 修改 `app/api/data/route.ts` 的数据解析逻辑
3. 在组件中添加新的展示元素

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request!
