# Todo App

A clean, minimal todo application built with vanilla JavaScript and a lightweight Node.js backend.

## Features

- Add, complete, and delete todos
- Persistent storage via SQLite — data survives server restarts
- Filter by All / Active / Completed
- Clear all completed todos in one click
- No build step, no frontend framework — just HTML, CSS, and JS

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | Vanilla JS, HTML, CSS             |
| Backend  | Node.js + Express                 |
| Database | SQLite via `better-sqlite3`       |

## Getting Started

```bash
# Install dependencies
npm install

# Start the server
node server.js
```

Then open http://localhost:3000 in your browser.

## API

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/api/todos`           | Fetch all todos           |
| POST   | `/api/todos`           | Create a new todo         |
| PUT    | `/api/todos/:id`       | Toggle completed status   |
| DELETE | `/api/todos/:id`       | Delete a todo             |
| DELETE | `/api/todos/completed` | Delete all completed todos|

## Project Structure

```
todo_app/
├── index.html      # App shell
├── style.css       # Styles
├── script.js       # Frontend logic (TodoApp class)
├── server.js       # Express server + REST API
├── package.json
└── todos.db        # Auto-generated SQLite database (gitignored)
```
