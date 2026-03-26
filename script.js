// 待办事项应用
class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = "all";
    this.init();
  }

  async init() {
    this.cacheElements();
    this.bindEvents();
    await this.loadTodos();
  }

  cacheElements() {
    this.todoInput = document.getElementById("todoInput");
    this.addBtn = document.getElementById("addBtn");
    this.todoList = document.getElementById("todoList");
    this.emptyState = document.getElementById("emptyState");
    this.clearCompletedBtn = document.getElementById("clearCompleted");
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.allCount = document.getElementById("allCount");
    this.activeCount = document.getElementById("activeCount");
    this.completedCount = document.getElementById("completedCount");
  }

  bindEvents() {
    this.addBtn.addEventListener("click", () => this.addTodo());
    this.todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTodo();
    });

    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.currentFilter = e.currentTarget.dataset.filter;
        this.updateFilterButtons();
        this.render();
      });
    });

    this.clearCompletedBtn.addEventListener("click", () =>
      this.clearCompleted(),
    );
  }

  async loadTodos() {
    const res = await fetch("/api/todos");
    this.todos = await res.json();
    this.render();
  }

  async addTodo() {
    const text = this.todoInput.value.trim();
    if (!text) {
      this.shakeInput();
      return;
    }

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const todo = await res.json();
    this.todos.unshift(todo);
    this.todoInput.value = "";
    this.render();

    this.todoInput.style.transform = "scale(0.98)";
    setTimeout(() => {
      this.todoInput.style.transform = "scale(1)";
    }, 100);
  }

  async toggleTodo(id) {
    const res = await fetch(`/api/todos/${id}`, { method: "PUT" });
    const updated = await res.json();
    const idx = this.todos.findIndex((t) => t.id === id);
    if (idx !== -1) this.todos[idx] = updated;
    this.render();
  }

  async deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    this.todos = this.todos.filter((t) => t.id !== id);
    this.render();
  }

  async clearCompleted() {
    const completedCount = this.todos.filter((t) => t.completed).length;
    if (completedCount === 0) return;

    if (confirm(`确定要删除 ${completedCount} 个已完成的任务吗？`)) {
      await fetch("/api/todos/completed", { method: "DELETE" });
      this.todos = this.todos.filter((t) => !t.completed);
      this.render();
    }
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case "active":
        return this.todos.filter((t) => !t.completed);
      case "completed":
        return this.todos.filter((t) => t.completed);
      default:
        return this.todos;
    }
  }

  updateFilterButtons() {
    this.filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === this.currentFilter);
    });
  }

  updateCounts() {
    const activeCount = this.todos.filter((t) => !t.completed).length;
    const completedCount = this.todos.filter((t) => t.completed).length;
    this.allCount.textContent = this.todos.length;
    this.activeCount.textContent = activeCount;
    this.completedCount.textContent = completedCount;
  }

  render() {
    const filteredTodos = this.getFilteredTodos();
    this.updateCounts();

    if (filteredTodos.length === 0) {
      this.emptyState.classList.add("show");
      this.todoList.style.display = "none";
    } else {
      this.emptyState.classList.remove("show");
      this.todoList.style.display = "block";
    }

    this.todoList.innerHTML = filteredTodos
      .map(
        (todo) => `
            <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${todo.id}">
                <div class="checkbox" onclick="app.toggleTodo(${todo.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </li>
        `,
      )
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  shakeInput() {
    this.todoInput.style.animation = "none";
    setTimeout(() => {
      this.todoInput.style.animation = "shake 0.5s";
    }, 10);
    setTimeout(() => {
      this.todoInput.style.animation = "";
    }, 500);
  }
}

// 添加抖动动画
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// 初始化应用
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new TodoApp();
});
