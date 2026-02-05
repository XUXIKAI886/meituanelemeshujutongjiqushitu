---
name: sync-dashboard-data
description: 自动同步美团和饿了么的Excel数据文件到dashboard，生成静态JSON数据，并推送到GitHub触发自动部署。
---

# 数据同步与自动部署 Skill

这个skill用于自动化美团&饿了么数据分析平台的数据更新和部署流程。

## 使用场景

当用户更新了根目录下的Excel数据文件（`美团数据.xlsx` 和 `饿了么数据.xlsx`）后，运行此skill可以：
1. 自动检查并验证Excel文件是否存在
2. 将最新的数据文件同步到dashboard应用
3. 生成静态JSON数据文件
4. 提交并推送到GitHub，触发自动部署

## 执行流程

### 1. 数据文件检查

首先检查根目录下的两个Excel文件是否存在：
- `美团数据.xlsx`
- `饿了么数据.xlsx`

如果文件不存在，提示用户需要先准备数据文件。

### 2. 数据同步

将根目录的Excel文件复制到 `data-dashboard/public/data/` 目录：
- 源文件：项目根目录
- 目标目录：`data-dashboard/public/data/`
- 操作：覆盖现有文件

### 3. 生成静态JSON数据

在 `data-dashboard/` 目录下执行数据生成脚本：
```bash
cd data-dashboard && node scripts/generate-data.js
```

这会将Excel数据转换为 `public/data/platform-data.json` 文件。

### 4. 提交并推送到GitHub

将更改提交到Git并推送到远程仓库，触发GitHub Actions自动部署：
- 添加更改的文件到暂存区
- 创建提交（包含数据更新说明）
- 推送到远程仓库

推送后，GitHub Actions会自动：
- 构建Next.js静态站点
- 部署到GitHub Pages

## 项目上下文

### 数据文件格式

**美团数据.xlsx** 包含以下列：
- 日期
- 美团解约店铺数
- 美团总抽点店铺数
- 美团总金额

**饿了么数据.xlsx** 包含以下列：
- 日期
- 饿了么解约店铺数
- 饿了么总店铺数
- 饿了么总代运营结算金额

### 技术架构

- **框架**: Next.js 16.0.3 (静态导出)
- **数据处理**: xlsx库读取Excel，构建时生成JSON
- **部署**: GitHub Pages + GitHub Actions
- **UI**: shadcn/ui组件库，响应式设计

### 线上地址

https://xuxikai886.github.io/meituanelemeshujutongjiqushitu/

## 执行步骤

按照以下步骤执行任务：

1. **检查数据文件**：
   ```bash
   cd "项目根目录" && ls -lh 美团数据.xlsx 饿了么数据.xlsx
   ```
   验证两个文件都存在，并显示文件大小和修改时间。

2. **同步数据文件**：
   ```bash
   cp "根目录/美团数据.xlsx" "data-dashboard/public/data/美团数据.xlsx"
   cp "根目录/饿了么数据.xlsx" "data-dashboard/public/data/饿了么数据.xlsx"
   ```

3. **验证同步结果**：
   ```bash
   cd "data-dashboard/public/data" && ls -lh *.xlsx
   ```
   确认文件已成功复制，修改时间为最新。

4. **生成静态JSON数据**：
   ```bash
   cd "data-dashboard" && node scripts/generate-data.js
   ```
   确认生成的JSON文件包含正确的数据条数。

5. **提交更改到Git**：
   ```bash
   git add 美团数据.xlsx 饿了么数据.xlsx data-dashboard/public/data/
   git commit -m "chore: 更新数据 $(date +%Y-%m-%d)"
   ```

6. **推送到远程仓库**：
   ```bash
   git push origin main
   ```

7. **报告完成状态**：
   向用户报告：
   - 数据文件同步成功（显示文件大小和修改时间）
   - JSON数据生成成功（显示数据条数）
   - 代码已推送到GitHub
   - 提示用户GitHub Actions正在自动部署
   - 提供线上访问地址：https://xuxikai886.github.io/meituanelemeshujutongjiqushitu/

## 注意事项

- 确保 `data-dashboard/public/data/` 目录存在
- 文件复制会覆盖现有文件，这是预期行为
- 推送后需等待GitHub Actions完成部署（通常1-2分钟）
- 可在 https://github.com/XUXIKAI886/meituanelemeshujutongjiqushitu/actions 查看部署状态

## 错误处理

- **文件不存在**：提示用户需要先在根目录准备Excel文件
- **目录不存在**：自动创建 `data-dashboard/public/data/` 目录
- **Git推送失败**：检查网络连接和仓库权限
- **数据生成失败**：检查Excel文件格式是否正确
