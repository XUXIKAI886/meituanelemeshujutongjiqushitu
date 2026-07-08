---
name: sync-dashboard-data
description: 自动同步美团和饿了么的Excel数据文件到dashboard，生成静态JSON数据，并推送到GitHub触发自动部署。
---

# 数据同步与自动部署 Skill

## 本 Skill 全局文档路径

`F:\claude-code\美团饿了么每日解约数据抽点数据\.claude\skills\sync-dashboard-data\SKILL.md`

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
   git push "https://XUXIKAI886@github.com/XUXIKAI886/meituanelemeshujutongjiqushitu.git" main
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
- 每日全流程中必须使用 `XUXIKAI886` 的显式远程 URL 推送，不要使用 `git push origin main`

## 错误处理

- **文件不存在**：提示用户需要先在根目录准备Excel文件
- **目录不存在**：自动创建 `data-dashboard/public/data/` 目录
- **Git推送失败**：检查网络连接和仓库权限
- **数据生成失败**：检查Excel文件格式是否正确

## 每日全流程记忆回写

被 `daily-workflow-executor` 调用时，必须记录：

- 两个源 Excel 的文件大小和修改时间
- 复制到 `data-dashboard/public/data/` 后的文件状态
- `generate-data.js` 输出的美团/饿了么数据条数
- `git commit` 输出摘要、`git rev-parse HEAD`、显式 URL 的 `git push` 输出
- 如果最终 `git status` 相对本地 `origin/main` 显示 `ahead`，必须用 `git ls-remote "https://XUXIKAI886@github.com/XUXIKAI886/meituanelemeshujutongjiqushitu.git" refs/heads/main` 验证远端 `main` hash 等于本次 commit；相等则不得因本地 `origin` 状态误判失败
- 最终 `git status`。如果只剩既有未跟踪文件，不影响本次数据推送成功，但必须如实记录
- 复核 `data-dashboard/public/data/platform-data.json` 条数时，注意该文件实际是数组结构，不是 `{ meituan, eleme }` 对象；应按 `platform` 找到 `美团` / `饿了么` 对应项，再读取该项的 `data.length`

### 每日全流程防错补充（2026-07-06）

- 本项目根目录没有 `main.py`，每日全流程禁止把 `python main.py` 当作入口。
- 正确流程是：复制根目录 `美团数据.xlsx` / `饿了么数据.xlsx` 到 `data-dashboard/public/data/`，进入 `data-dashboard` 执行 `node scripts/generate-data.js`，核对 `platform-data.json` 为数组结构且包含 `美团` / `饿了么` 平台条数，再 `git add 美团数据.xlsx 饿了么数据.xlsx data-dashboard/public/data/`、`git commit`、用 `https://XUXIKAI886@github.com/XUXIKAI886/meituanelemeshujutongjiqushitu.git` 显式推送 `main`。
- PowerShell 预检查中若要把 `foreach` 输出接 `Format-Table`，必须写成 `& { foreach (...) { ... } } | Format-Table -AutoSize | Out-String`；不要写 `foreach (...) { ... } | Format-Table`，否则会在业务复制、生成和提交前触发 ParserError。

### 每日全流程防错补充（2026-07-08）

- 本 Dashboard 的 `美团数据.xlsx` / `饿了么数据.xlsx` 中回款金额和回款店铺数必须以 `F:\claude-code\饿了么美团回款数据统计系统\public\data\meituanData.json` 与 `elmCycleData.json` 为准；如果平台回溯修正或单日补查覆盖了历史日期，必须同步修正根目录 Excel、`data-dashboard/public/data/` Excel 和 `platform-data.json`。
- 生成 `platform-data.json` 后，必须抽查目标日期的 `totalRevenue` 与 `commissionStores`：美团对比 `meituanData.json.totalAmount/shopCount`，饿了么对比 `elmCycleData.json.totalAmount/shopCount`。金额一致但店铺数不一致也算失败，禁止只核对金额。
- 2026-07-06 已知修正基准：美团应为 `totalRevenue=3276.96`、`commissionStores=381`；饿了么应为 `totalRevenue=1248.68`、`commissionStores=246`。旧 Dashboard 数据曾为美团 `1471.33/163`、饿了么 `1248.68/249`，遇到该值必须判定为未同步旧数据。
