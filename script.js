const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const dueDate = document.getElementById("due-date");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const container = document.getElementById("tasks-container");

let tasks = JSON.parse(localStorage.getItem("advancedTasks")) || [];

function saveTasks() {
  localStorage.setItem("advancedTasks", JSON.stringify(tasks));
}

function renderTasks() {
  container.innerHTML = "";
  const categories = {};

  tasks.forEach((task, index) => {
    if (!categories[task.category]) categories[task.category] = [];
    categories[task.category].push({ ...task, index });
  });

  for (let cat in categories) {
    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = cat;
    container.appendChild(title);

    categories[cat].forEach(({ text, date, priority, completed, index }) => {
      const div = document.createElement("div");
      div.className = "task";
      if (completed) div.classList.add("completed");

      const info = document.createElement("span");
      info.innerHTML = `<strong>${text}</strong><br>
        Due: ${date || "N/A"} | Priority: ${priority.toUpperCase()}`;

      info.onclick = () => toggleComplete(index);

      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = () => editTask(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.onclick = () => deleteTask(index);

      actions.append(editBtn, deleteBtn);
      div.append(info, actions);
      container.appendChild(div);
    });
  }
}

function addTask(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text,
    date: dueDate.value,
    priority: priority.value,
    category: category.value,
    completed: false
  });

  input.value = "";
  dueDate.value = "";
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

form.addEventListener("submit", addTask);
renderTasks();
