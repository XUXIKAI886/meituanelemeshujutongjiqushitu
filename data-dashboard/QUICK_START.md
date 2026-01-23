# 快速开始指南

## 🚀 5分钟启动项目

### 步骤 1: 安装依赖
```bash
cd data-dashboard
npm install
```

### 步骤 2: 启动开发服务器
```bash
npm run dev
```

### 步骤 3: 打开浏览器
访问 [http://localhost:3000](http://localhost:3000)

---

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 运行生产服务器 |
| `npm run lint` | 代码检查 |

---

## 📁 数据文件位置

数据文件存放在:
```
public/data/
├── 美团数据.xlsx
└── 饿了么数据.xlsx
```

**Excel 表格格式:**

| 日期 | 解约数 | 抽点店铺数 | 回款总金额 |
|------|--------|-----------|-----------|
| 2024-01-01 | 100 | 50 | 10000 |
| 2024-01-02 | 150 | 60 | 12000 |

---

## 🎨 技术栈概览

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **UI库**: shadcn/ui
- **图表**: Recharts
- **图标**: Lucide React

---

## 📊 核心功能

✅ **数据统计**
- 总解约数
- 总抽点店铺数
- 总回款金额
- 日均数据

✅ **趋势可视化**
- 解约数趋势折线图
- 抽点店铺数趋势折线图
- 回款金额趋势折线图

✅ **数据对比**
- 美团 vs 饿了么
- 双平台并排展示
- 明细数据表格

---

## 🔧 常见问题

### Q: 数据文件在哪里?
A: `public/data/` 目录,包含 `美团数据.xlsx` 和 `饿了么数据.xlsx`

### Q: 如何更新数据?
A: 替换 `public/data/` 中的 Excel 文件,刷新页面即可

### Q: 如何修改颜色主题?
A: 编辑 `app/globals.css` 中的 CSS 变量

### Q: 如何部署到线上?
A: 参考 `DEPLOYMENT.md` 文档

### Q: 支持哪些浏览器?
A: Chrome, Firefox, Safari, Edge (最新版本)

---

## 📦 项目结构速览

```
data-dashboard/
├── app/              # Next.js 应用
│   ├── api/data/     # 数据 API
│   └── page.tsx      # 主页面
├── components/       # React 组件
│   ├── charts.tsx    # 图表
│   ├── data-table.tsx # 表格
│   └── stats-cards.tsx # 统计卡片
├── lib/              # 工具函数
└── public/data/      # Excel 数据
```

---

## 🌐 部署到 Vercel

### 方法 1: GitHub 自动部署
```bash
# 1. 创建 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub
git remote add origin YOUR_REPO_URL
git push -u origin main

# 3. 在 Vercel 导入项目
# 访问 vercel.com/new
```

### 方法 2: Vercel CLI 部署
```bash
# 安装 CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

---

## 📝 开发提示

### 添加新的数据列
1. 更新 `lib/types.ts` 类型定义
2. 修改 `app/api/data/route.ts` 解析逻辑
3. 在组件中展示新数据

### 自定义图表颜色
编辑 `components/charts.tsx`:
```typescript
stroke="#YOUR_COLOR"  // 修改线条颜色
```

### 修改页面标题
编辑 `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "你的标题",
  description: "你的描述",
};
```

---

## 📞 获取帮助

- 📖 完整文档: `README.md`
- 🏗️ 项目概览: `PROJECT_OVERVIEW.md`
- 🚀 部署指南: `DEPLOYMENT.md`
- 💻 Next.js 文档: [nextjs.org/docs](https://nextjs.org/docs)
- 🎨 shadcn/ui: [ui.shadcn.com](https://ui.shadcn.com)

---

## ✨ 下一步

- [ ] 查看数据可视化效果
- [ ] 尝试修改样式和配色
- [ ] 添加自己的数据
- [ ] 部署到 Vercel
- [ ] 分享给团队成员

**祝你使用愉快! 🎉**
