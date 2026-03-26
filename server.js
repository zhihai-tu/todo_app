const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const db = new Database(path.join(__dirname, "todos.db"));

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);

app.use(express.json());
app.use(express.static(__dirname));

// 查询全部（按创建时间倒序）
app.get("/api/todos", (req, res) => {
  const todos = db.prepare("SELECT * FROM todos ORDER BY id DESC").all();
  res.json(todos.map((t) => ({ ...t, completed: t.completed === 1 })));
});

// 新增
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim())
    return res.status(400).json({ error: "内容不能为空" });
  const createdAt = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO todos (text, completed, createdAt) VALUES (?, 0, ?)")
    .run(text.trim(), createdAt);
  res.json({
    id: result.lastInsertRowid,
    text: text.trim(),
    completed: false,
    createdAt,
  });
});

// 切换完成状态
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  if (!todo) return res.status(404).json({ error: "未找到" });
  const newCompleted = todo.completed === 1 ? 0 : 1;
  db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(
    newCompleted,
    id,
  );
  res.json({ ...todo, completed: newCompleted === 1 });
});

// 删除单条
app.delete("/api/todos/completed", (req, res) => {
  db.prepare("DELETE FROM todos WHERE completed = 1").run();
  res.json({ ok: true });
});

app.delete("/api/todos/:id", (req, res) => {
  db.prepare("DELETE FROM todos WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Todo App 运行中: http://localhost:${PORT}`);
});
