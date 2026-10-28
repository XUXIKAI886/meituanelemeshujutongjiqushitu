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

### 每日全流程防错补充（2026-07-09）

- 每日全流程中如果步骤8 `excel-sync-and-push` 在步骤7之后更新了回款系统标准 JSON，必须回补执行本 Skill：重新复制根目录 `美团数据.xlsx` / `饿了么数据.xlsx` 到 `data-dashboard/public/data/`，重新运行 `node scripts/generate-data.js`，再复核并推送或确认远端已是最新。
- 复核 `platform-data.json` 时，不能用同一个目标日期同时校验美团和饿了么。应分别读取 `F:\claude-code\饿了么美团回款数据统计系统\public\data\meituanData.json` 与 `elmCycleData.json` 的各自最新有效日期，再到 `platform-data.json` 对应平台中查同日 `totalRevenue` / `commissionStores`，分别与 `totalAmount` / `shopCount` 对比。
- 回补生成后如果 `platform-data.json` 已核对通过，显式 URL `git ls-remote` 远端 `main` hash 等于当前提交，但 `git commit` 输出 `nothing added to commit` 且只剩既有未跟踪文件，不得判失败；记录“无新跟踪变更，远端已是最新”即可。
- JSON 金额跨系统核对必须使用数值容差，例如 `Math.abs(actual - expected) < 1e-8`；禁止用严格相等比较二进制浮点数。店铺数仍必须严格相等。
- PowerShell 判断暂存区是否有变更时，先执行 `git diff --cached --quiet`，再读取 `$LASTEXITCODE`：`0` 表示无差异，`1` 表示有差异；禁止把该命令的空输出直接当布尔值。

### 每日全流程防错补充（2026-07-12）

- 如果 `platform-data.json` 与回款系统标准 JSON 金额一致但店铺数不一致，必须以 `F:\claude-code\饿了么美团回款数据统计系统\public\data\meituanData.json` / `elmCycleData.json` 为准修正根目录 `美团数据.xlsx` / `饿了么数据.xlsx` 对应日期，再复制到 `data-dashboard/public/data/`、重新运行 `node scripts/generate-data.js`、复核金额和店铺数并推送。
- 使用 Node 修正 Excel 时，必须在 `data-dashboard` 目录执行修正脚本，或显式使用该目录下已安装的 `xlsx` 依赖。不要把依赖 `xlsx` 的脚本写到 `%TEMP%` 后直接运行，否则会报 `Cannot find module 'xlsx'`，Excel 不会被修改，后续生成仍会失败。

### 每日全流程防错补充（2026-07-13）

- 每日全流程中步骤8可能在本步骤初次推送后再次覆盖修正 `elmCycleData.json` 或 `meituanData.json`。步骤8完成后必须再次回到本 Skill：分别取标准 JSON 的最新有效日期，核对 dashboard 同平台同日的 `totalRevenue` 与 `commissionStores`。即使金额一致但店铺数不同，也必须以标准 JSON 修正根目录 Excel 后重新生成并推送。
- `饿了么数据.xlsx` 当前列结构为：日期、`饿了么总代运营结算金额`、`饿了么总店铺数`、`饿了么解约店铺数`。按 `elmCycleData.json.shopCount` 修正时应写第 3 列，不得误改第 4 列解约店铺数。

### 每日全流程防错补充（2026-07-15）

- 根目录 Excel 检查和复制必须从 `F:\claude-code\美团饿了么每日解约数据抽点数据` 执行；进入 `data-dashboard` 后只运行 `node scripts/generate-data.js`。子目录中的相对源路径不存在时，即使生成脚本返回 0，也必须按复制失败处理并从项目根目录重跑。

### 每日全流程防错补充（2026-07-26）

- 步骤8回款系统同步后，Dashboard 回补必须全量对比 `data-dashboard/public/data/platform-data.json` 与标准 `F:\claude-code\饿了么美团回款数据统计系统\public\data\meituanData.json` / `elmCycleData.json` 的重叠日期，不要只抽查最新日期。金额使用容差，店铺数严格相等。
- 若发现差异，修正根目录 Excel 时只更新回款字段：美团更新第3列“美团总抽点店铺数”和第4列“美团总金额”；饿了么更新第2列“饿了么总代运营结算金额”和第3列“饿了么总店铺数”；禁止改第2/第4列解约字段。PowerShell 中不要使用 bash heredoc `python - <<'PY'`，应使用 here-string 管道或项目内 Node 脚本。

### 每日全流程防错补充（2026-07-30）

- Dashboard 回补写 Excel 时，金额字段必须先按容差判断是否真实不一致；只有金额差超过容差才写金额，店铺数字段仍严格比较后写回。不要仅为了把浮点数重新序列化为两位小数而重写历史行，否则会产生大面积等值 diff 并掩盖真正的店铺数修正。

### 每日全流程防错补充（2026-08-10）

- `daily-workflow-executor` 的固定顺序是先执行本步骤、后执行步骤8回款同步。步骤8尚未运行时，`meituanData.json` / `elmCycleData.json` 及 `sync-meta.json` 可能仍对应前一天账单；此时跨系统比较只能作为诊断，禁止用旧标准 JSON 反向覆盖当天刚由步骤2生成的根目录 Excel 回款字段。
- 判断标准是否已刷新时，应核对 `sync-meta.json.updatedAt` 和实际源文件是否对应本轮步骤1下载的账单。未刷新时先从当前根目录 Excel 生成 Dashboard；步骤8完成后再把新标准 JSON 作为最终权威口径，执行全部重叠日期全量对比、必要回写、重新生成和第二次推送。
- 饿了么出现“金额一致但店铺数不同”时，应检查零结算门店口径：回款标准处理会先过滤结算金额为0的行，再统计门店数。最终 Dashboard 店铺数以步骤8更新后的 `elmCycleData.json.shopCount` 为准，只改回款金额/店铺数字段，不得改解约列。

### 每日全流程防错补充（2026-08-13）

- Dashboard 回补 Excel 禁止使用 `XLSX.utils.aoa_to_sheet`、整表导出或其他重建工作簿方式；这类写法即使数值正确，也可能清除样式、公式、合并单元格、冻结窗格、列宽和日期格式。必须使用 `openpyxl` 等支持保留原工作簿结构的工具做单元格级写入，只修改已核对出的回款金额或店铺数单元格。
- 写入前后必须分别核对工作表名、`max_row` / `max_column`、样式 ID 集合、公式数量、合并区域、冻结窗格、列宽和解约列值；根目录 Excel 与 `data-dashboard/public/data/` 副本必须在复制后 SHA-256 一致。任一结构或非目标字段变化，都不得提交，必须从写入前基线恢复后重新做单元格级修正。
- 重新生成 `platform-data.json` 后，仍需对两个平台全部重叠日期做金额容差与店铺数严格比较；Excel 结构保留验证和业务值全量一致性验证必须同时通过，不能只凭 JSON 数据正确判定回补成功。
- 复制、Excel 写入、JSON 生成、Git 提交/推送等业务操作必须与 PowerShell `foreach` 格式化核对拆成不同命令；先完成并验证业务操作，再运行只读核对。格式化循环输出时先赋值或包入 `& { ... }` 后再接 `Format-Table` / `Format-List`，禁止让解析阶段错误阻断业务写入。

### 每日全流程防错补充（2026-08-21）

- 创建 `data-dashboard/public/data/` 目录时，优先使用 `New-Item -ItemType Directory -Force -Path <dir>`；不要用 `New-Item -LiteralPath` 创建目录，部分本机 PowerShell 会报 `A parameter cannot be found that matches parameter name 'LiteralPath'`。若目录已存在且复制后的两个 Excel 已核对成功，可记录为非业务阻断。
- 使用 `node -e` 复核 `platform-data.json` 时，PowerShell 命令字符串不要在双引号中包含 JavaScript 模板字符串反引号；外层 shell 可能吞掉 `${...}` 导致 Node 语法错误。应使用单引号包裹 `node -e` 脚本，或用普通字符串拼接输出。

### 每日全流程防错补充（2026-08-31）

- 步骤8后回补 Dashboard Excel 时，只保存和复制存在真实目标字段变更的平台工作簿。若某个平台全量对比无金额/店铺数差异，不要调用保存；否则 openpyxl 可能产生无业务含义的二进制差异。
- 如果误保存无业务差异的 Excel，提交前必须用 `git diff --stat` / 全量业务值核对确认是 `0 insertions / 0 deletions` 且无目标字段变化，再只恢复这些无意义差异。禁止把无业务变更的 Excel 二进制重写纳入 Dashboard 回补提交。

### 每日全流程防错补充（2026-09-04）

- 步骤8后回补做 Excel 结构只读核对时，不要使用 `openpyxl.load_workbook(..., read_only=True)` 后读取 `freeze_panes`、合并区域或其他普通工作表元数据；只读工作表不保证这些属性可用。若检查在任何写入前失败，应记录未发生业务写入，改用普通加载重跑结构核对。

### 每日全流程防错补充（2026-09-07）

- 显式 GitHub HTTPS push 若出现 `Recv failure: Connection was reset`、`Failed to connect to github.com port 443` 或同类网络错误，必须保留本地 commit，不重复复制 Excel、生成 JSON、`git add` 或 `git commit`；先记录失败命令和退出码，只重试同一显式 URL 的 `git push`。重试成功后必须用同一显式 URL 的 `git ls-remote ... refs/heads/main` 核对远端 hash 等于本次 commit；连续重试仍失败时停止本步骤并等待网络恢复。

### 每日全流程防错补充（2026-09-09）

- 步骤8后回补 Dashboard 时，如果 Python 脚本内调用 `node scripts/generate-data.js` 并捕获中文输出，必须显式设置 `encoding='utf-8'`，或把 Node 生成与只读核对拆成两个独立命令。Windows 默认 GBK 可能导致 `UnicodeDecodeError`，但业务单元格写入可能已经完成；遇到该情况时不要重复无差异写入或回滚，先单独重跑 `node scripts/generate-data.js`，再执行全量重叠日期一致性核对。

### 每日全流程防错补充（2026-09-10）

- 当根目录 Excel 已复制、`platform-data.json` 已生成、本地数据 commit 已创建后，如果指定远端 `git push 'https://XUXIKAI886@github.com/XUXIKAI886/meituanelemeshujutongjiqushitu.git' main` 连续两次因 GitHub 443 网络错误失败，且同一显式 URL 的 `git ls-remote ... refs/heads/main` 也返回 443/退出码 128，必须保留本地 commit 并停止本步骤。恢复网络后只重试同一 commit 的显式 `git push` 和 `git ls-remote` hash 闭环；禁止重复复制 Excel、重新生成 JSON、再次 `git add` 或创建新 commit。

### 每日全流程防错补充（2026-09-30）

- 执行 `node scripts/generate-data.js` 前确认当前目录；如果已经位于 `data-dashboard`，直接运行 `node scripts/generate-data.js`，不要再次拼接 `data-dashboard` 子目录。

### 每日全流程验证补充（2026-10-10）

- 最终推送后确认线上生效时，读取 `https://xuxikai886.github.io/meituanelemeshujutongjiqushitu/data/platform-data.json?verify=<本次commit>`，保存到当日执行证据目录；要求 HTTP 200、可解析为 JSON，并与本地最终 `data-dashboard/public/data/platform-data.json` 全量一致。记录两平台条数和比较结果，可用于证明数据部署已生效。若 Actions 尚未完成或线上仍缓存旧内容，只等待并复查部署/数据请求，不重跑已成功的 Excel 同步、回款修正或创建无差异提交。
