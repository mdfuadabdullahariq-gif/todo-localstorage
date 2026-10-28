const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const submitBtn = document.getElementById("submit-btn");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const clearCompleted = document.getElementById("clear-completed");
const filterButton = document.getElementById("[data-filter]");

const STORAGE_KEY = "todoList";

let todos = loadTodos();
let currentFilter = "all";
let editingId = null;

// load todos from local LocalStorage
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : [];

    return Array.isArray(data)
      ? data.filter(
          (todo) =>
            todo &&
            typeof todo.id === "string" &&
            typeof todo.text === "string" &&
            typeof todo.completed === "boolean",
        )
      : [];
  } catch {
    return [];
  }
}

// save todos to localstorage
function savetodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Add or update a task
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  if (editingId !== null) {
    todos = todos.map((todo) =>
      todos.id === editingId ? { ...todo, text } : todo,
    );

    editingId = null;
    submitBtn.textContent = "Add Task";
  } else {
    todos.push({
      id: crypto.randomUUID(),
      text: text,
      completed: false,
    });
  }

  savetodos();
  form.reset();
  renderTodos();
});

// Display todos
function renderTodos() {
  todoList.replaceChildren();

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent =
      todos.length === 0 
      ? "No tasks yet!" 
      : "No tasks in this filter!";
    todoList.appendChild(empty);
  }

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    if (todo.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");

    chechbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      savetodos();
      renderTodos();
    });

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const editbtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      input.value = todo.text;
      editingId = todo.id;
      
    });
  });
}
