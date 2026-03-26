# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # 安装依赖
node server.js    # 启动服务（访问 http://localhost:3000）
```

无构建步骤，无测试框架。

## Architecture

纯前端 + 轻量 Node.js 后端，无框架，无打包工具。

**后端 (`server.js`)**
- Express 静态托管整个项目目录（`express.static(__dirname)`），`index.html` 直接由 Express 提供
- REST API 挂载在 `/api/todos`，使用 `better-sqlite3`（同步 API）操作本地 `todos.db`
- 路由顺序关键：`DELETE /api/todos/completed` 必须在 `DELETE /api/todos/:id` 之前注册，否则 `completed` 会被匹配为 `:id`

**前端 (`script.js`)**
- 单一 `TodoApp` class，维护内存中的 `this.todos` 数组作为本地缓存
- 所有写操作先调 API，成功后直接修改本地数组并重新 `render()`，不重新 fetch
- `render()` 是全量重绘（`innerHTML` 替换），无虚拟 DOM

**数据流**：页面加载 → `GET /api/todos` → 存入 `this.todos` → 用户操作 → fetch API → 更新 `this.todos` → `render()`

**数据库**：`todos.db`（SQLite 单文件，运行后自动生成），表结构：`id, text, completed(0/1), createdAt`
