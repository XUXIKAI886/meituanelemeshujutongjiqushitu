# 部署指南

本文档说明如何将数据分析平台部署到 Vercel。

## 前置准备

1. **GitHub 账号**: 需要一个 GitHub 账号来托管代码
2. **Vercel 账号**: 访问 [vercel.com](https://vercel.com) 注册账号(可以使用 GitHub 账号直接登录)
3. **数据文件**: 确保 `public/data/` 目录包含必要的 Excel 文件

## 部署步骤

### 方法一: 通过 GitHub (推荐)

#### 1. 初始化 Git 仓库

```bash
cd data-dashboard
git init
git add .
git commit -m "Initial commit: 美团&饿了么数据分析平台"
```

#### 2. 推送到 GitHub

在 GitHub 上创建新仓库,然后:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### 3. 在 Vercel 上导入项目

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击 "Import Git Repository"
3. 选择你刚创建的 GitHub 仓库
4. 配置项目设置:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
5. 点击 "Deploy"

#### 4. 等待部署完成

部署通常需要 1-3 分钟。完成后,Vercel 会提供一个唯一的 URL。

### 方法二: 使用 Vercel CLI

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署项目

在项目根目录执行:

```bash
vercel
```

按照提示完成配置:
- Set up and deploy? **Y**
- Which scope? 选择你的账号
- Link to existing project? **N**
- What's your project's name? 输入项目名称
- In which directory is your code located? **./data-dashboard**

#### 4. 生产环境部署

```bash
vercel --prod
```

## 环境变量配置 (可选)

如果需要配置环境变量,在 Vercel 项目设置中添加:

1. 进入项目 Dashboard
2. 点击 "Settings" > "Environment Variables"
3. 添加需要的环境变量

## 数据文件处理

### 选项 1: 包含在仓库中 (适合小文件)

将数据文件提交到 Git:

```bash
git add public/data/*.xlsx
git commit -m "Add data files"
git push
```

### 选项 2: 使用外部存储 (适合大文件或频繁更新)

1. 将数据文件上传到云存储(如 AWS S3、阿里云 OSS)
2. 修改 `app/api/data/route.ts` 从外部源读取数据
3. 配置相应的访问凭证作为环境变量

## 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 更新部署

### 自动部署 (推荐)

每次推送到 GitHub 的 main 分支时,Vercel 会自动重新部署:

```bash
git add .
git commit -m "Update data or code"
git push
```

### 手动部署

使用 Vercel CLI:

```bash
vercel --prod
```

## 性能优化建议

1. **启用 Edge Caching**: 在 `vercel.json` 中配置缓存策略
2. **图片优化**: 使用 Next.js Image 组件
3. **代码分割**: Next.js 自动处理,无需额外配置
4. **压缩资源**: Vercel 自动启用 Brotli/Gzip 压缩

## 监控和分析

1. **访问统计**: Vercel Analytics (需要升级到 Pro 计划)
2. **错误监控**: 集成 Sentry 或其他监控服务
3. **性能监控**: Vercel Speed Insights

## 故障排查

### 部署失败

查看构建日志:
1. 在 Vercel Dashboard 找到失败的部署
2. 点击查看详细日志
3. 根据错误信息修复问题

### 常见问题

**问题**: 数据文件未找到
- **解决**: 确保文件在 `public/data/` 目录且已提交到仓库

**问题**: 构建超时
- **解决**: 优化依赖,减少构建时间,或升级 Vercel 计划

**问题**: API 路由返回 500 错误
- **解决**: 检查服务器日志,确保 Excel 文件格式正确

## 成本估算

- **Hobby 计划** (免费):
  - 100GB 带宽/月
  - 无限部署
  - 自动 HTTPS
  - 适合个人项目和小团队

- **Pro 计划** ($20/月):
  - 1TB 带宽/月
  - 高级分析
  - 密码保护
  - 适合专业项目

## 支持和帮助

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 文档**: https://nextjs.org/docs
- **社区支持**: https://github.com/vercel/next.js/discussions
