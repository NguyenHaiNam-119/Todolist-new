const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo__list");

const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskToDelete = null;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const task = input.value.trim();
  if (task !== "") {
    const taskObj = { id: Date.now(), text: task, completed: false };
    tasks.push(taskObj);
    saveTasks();
    renderTask(taskObj);
    input.value = "";
  }
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(taskObj) {
  const li = document.createElement("li");
  li.className = "task";
  li.dataset.id = taskObj.id;

  const label = document.createElement("label");
  label.className = "task__label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = taskObj.completed;

  const span = document.createElement("span");
  span.className = "task__text";
  span.textContent = taskObj.text;
  if (taskObj.completed) span.classList.add("completed");

  label.appendChild(checkbox);
  label.appendChild(span);

  const actions = document.createElement("div");
  actions.className = "task__actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task__btn--delete";
  deleteBtn.textContent = "Delete";

  const editBtn = document.createElement("button");
  editBtn.className = "task__btn--edit";
  editBtn.textContent = "Edit";

  actions.appendChild(deleteBtn);
  actions.appendChild(editBtn);

  li.appendChild(label);
  li.appendChild(actions);
  list.appendChild(li);

  checkbox.addEventListener("change", () => {
    span.classList.toggle("completed", checkbox.checked);
    const task = tasks.find(t => t.id === taskObj.id);
    if (task) {
      task.completed = checkbox.checked;
      saveTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    taskToDelete = li;
    confirmModal.classList.remove("hidden");
  });

  editBtn.addEventListener("click", () => {
    const currentText = span.textContent;
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = currentText;
    inputEdit.className = "form__input";

    label.replaceChild(inputEdit, span);
    inputEdit.focus();

    function saveEdit() {
      const newValue = inputEdit.value.trim();
      if (newValue !== "") {
        span.textContent = newValue;
        const task = tasks.find(t => t.id === taskObj.id);
        if (task) {
          task.text = newValue;
          saveTasks();
        }
      }
      label.replaceChild(span, inputEdit);
    }

    inputEdit.addEventListener("blur", saveEdit);
    inputEdit.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        saveEdit();
      }
    });
  });
}

// Modal xử lý xác nhận xóa
confirmYes.addEventListener("click", () => {
  if (taskToDelete) {
    const id = parseInt(taskToDelete.dataset.id);
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    taskToDelete.remove();
    taskToDelete = null;
  }
  confirmModal.classList.add("hidden");
});

confirmNo.addEventListener("click", () => {
  taskToDelete = null;
  confirmModal.classList.add("hidden");
});

// Render lại tất cả task khi tải lại
tasks.forEach(task => renderTask(task));
