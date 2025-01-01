const todoApp = {
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  Render() {
    if (this.tasks.length === 0) {
      task_list.innerHTML = `<li class='task-message'>
      <div class="task-item__name">No tasks available</div>
      </li>`;
      return;
    }
    const html = this.tasks
      .map((item, index) => {
        return `<li class='task-item ${
          item.completed ? "completed" : ""
        }'  data-index=${index}>
  <div class="task-item__name">${escapeHtml(item.task)}</div>
  <div class="task-item__controls">
          <button class="task__btn edit">Edit</button>
          <button class="task__btn ${item.completed ? "done" : "undone"}">${
          item.completed ? "Mask as undone" : "Mask as done"
        }</button>
          <button class="task__btn delete">Delete</button>
        </div>
  </li>`;
      })
      .join("");
    task_list.innerHTML = html;
  },
  addTask(taskName) {
    this.tasks.push({
      task: taskName,
      completed: false,
    });
  },
  removeTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
  },
  editTask(taskIndex, taskName) {
    this.tasks[taskIndex].task = taskName;
  },
  updateTaskStatus(taskIndex) {
    this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
  },
};

const editBtn = document.querySelector(".edit");
const task_list = document.querySelector(".task-list");
const todoForm = document.querySelector(".app__form");
function save() {
  localStorage.setItem("tasks", JSON.stringify(todoApp.tasks));
}
function isDuplicate(taskName, taskIndex = -1) {
  return todoApp.tasks.some(
    (item, index) =>
      item.task.toUpperCase() === taskName.toUpperCase() && index != taskIndex
  );
}
function escapeHtml(unsafeHtml) {
  const div = document.createElement("div");
  div.innerText = unsafeHtml;
  return div.innerHTML;
}
todoForm.onsubmit = function (e) {
  e.preventDefault();
  const input = document.querySelector(".app__input");
  const taskName = input.value.trim();
  if (!taskName) {
    alert("Please enter a task name");
    return;
  }
  if (isDuplicate(taskName)) {
    alert("Task already exists");
    return;
  }
  todoApp.addTask(taskName);
  save();
  todoApp.Render();
  input.value = "";
};
task_list.onclick = function (e) {
  const taskItem = e.target.closest(".task-item");
  if (!taskItem) return;
  const taskIndex = taskItem.dataset.index;
  const taskName = todoApp.tasks[taskIndex].task;
  if (e.target.closest(".edit")) {
    const newTaskName = prompt("Edit task", taskName);
    if (!newTaskName || !newTaskName.trim()) {
      alert("Please enter a valid task name");
      return;
    }
    if (isDuplicate(newTaskName, taskIndex)) {
      alert("Task already exists");
      return;
    }
    todoApp.editTask(taskIndex, newTaskName);
    save();
    todoApp.Render();
  } else if (e.target.closest(".delete")) {
    if (confirm("Are you sure you want to delete this task?")) {
      todoApp.removeTask(taskIndex);
      save();
      todoApp.Render();
    }
  } else if (e.target.closest(".done") || e.target.closest(".undone")) {
    todoApp.updateTaskStatus(taskIndex);
    save();
    todoApp.Render();
  }
};

todoApp.Render();
