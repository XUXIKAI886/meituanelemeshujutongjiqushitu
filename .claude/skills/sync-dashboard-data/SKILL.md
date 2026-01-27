---
name: sync-dashboard-data
description: 自动同步美团和饿了么的Excel数据文件到dashboard，并启动开发服务器。当用户更新了数据表格后，运行此skill可自动完成数据同步和服务器启动。
---

# 数据同步与服务器启动 Skill

这个skill用于自动化美团&饿了么数据分析平台的数据更新流程。

## 使用场景

当用户更新了根目录下的Excel数据文件（`美团数据.xlsx` 和 `饿了么数据.xlsx`）后，运行此skill可以：
1. 自动检查并验证Excel文件是否存在
2. 将最新的数据文件同步到dashboard应用
3. 启动开发服务器，展示最新数据

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

复制完成后，显示文件的修改时间和大小，确认同步成功。

### 3. 启动开发服务器

在 `data-dashboard/` 目录下执行 `npm run dev` 启动Next.js开发服务器。

服务器启动后：
- 本地访问地址：http://localhost:3000
- 自动读取最新的Excel数据
- 实时展示数据分析结果

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

- **框架**: Next.js 16.0.3 (Turbopack)
- **数据处理**: xlsx库读取Excel文件
- **API**: `/api/data` 路由处理数据读取和转换
- **UI**: shadcn/ui组件库，响应式设计

## 执行步骤

按照以下步骤执行任务：

1. **使用TodoWrite工具创建任务列表**，包含以下任务：
   - 检查Excel文件是否存在
   - 同步数据文件到dashboard
   - 启动开发服务器

2. **检查数据文件**：
   ```bash
   cd "项目根目录" && ls -lh 美团数据.xlsx 饿了么数据.xlsx
   ```
   验证两个文件都存在，并显示文件大小和修改时间。

3. **同步数据文件**：
   ```bash
   cp "根目录/美团数据.xlsx" "data-dashboard/public/data/美团数据.xlsx"
   cp "根目录/饿了么数据.xlsx" "data-dashboard/public/data/饿了么数据.xlsx"
   ```

4. **验证同步结果**：
   ```bash
   cd "data-dashboard/public/data" && ls -lh *.xlsx
   ```
   确认文件已成功复制，修改时间为最新。

5. **启动开发服务器**：
   ```bash
   cd "data-dashboard" && npm run dev
   ```
   使用 `run_in_background=true` 参数在后台运行。

6. **等待服务器启动**：
   等待5-10秒，然后读取服务器输出，确认服务器成功启动。

7. **报告完成状态**：
   向用户报告：
   - 数据文件同步成功（显示文件大小和修改时间）
   - 服务器启动成功（显示访问地址）
   - 提示用户可以访问 http://localhost:3000 查看最新数据

## 注意事项

- 如果服务器已经在运行，先检查是否需要停止旧的服务器进程
- 确保 `data-dashboard/public/data/` 目录存在
- 文件复制会覆盖现有文件，这是预期行为
- 开发服务器会自动检测文件变化并刷新数据

## 错误处理

- **文件不存在**：提示用户需要先在根目录准备Excel文件
- **目录不存在**：自动创建 `data-dashboard/public/data/` 目录
- **服务器启动失败**：检查端口3000是否被占用，提示用户处理
- **npm依赖问题**：提示用户先运行 `npm install`
