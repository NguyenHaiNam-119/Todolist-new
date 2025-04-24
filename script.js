class Todo {
  constructor() {
    this.form = document.getElementById("todo-form");
    this.input = document.getElementById("todo-input");
    this.list = document.getElementById("todo__list");

    this.confirmModal = document.getElementById("confirmModal");
    this.confirmYes = document.getElementById("confirmYes");
    this.confirmNo = document.getElementById("confirmNo");

    this.logoutButton = document.getElementById("logout-button");

    this.username = localStorage.getItem("currentUser");
    if (!this.username) {
      window.location.href = "login.html";
    } else {
      document.getElementById("user-name").textContent = this.username;
    }

    this.tasks = JSON.parse(localStorage.getItem(`tasks_${this.username}`)) || [];
    this.taskToDelete = null;

    this.form.addEventListener("submit", (e) => this.addTask(e));
    this.confirmYes.addEventListener("click", () => this.confirmDelete());
    this.confirmNo.addEventListener("click", () => this.cancelDelete());
    this.tasks.forEach((task) => this.renderTask(task));

    if (this.logoutButton) {
      this.logoutButton.addEventListener("click", () => this.logout());
    }
  }

  logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }

  saveTasks() {
    localStorage.setItem(`tasks_${this.username}`, JSON.stringify(this.tasks));
  }

  addTask(e) {
    e.preventDefault();
    const text = this.input.value.trim();
    if (text) {
      const taskObj = { id: Date.now(), text, completed: false };
      this.tasks.push(taskObj);
      this.saveTasks();
      this.renderTask(taskObj);
      this.input.value = "";
    }
  }

  renderTask(taskObj) {
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
    this.list.appendChild(li);

    checkbox.addEventListener("change", () =>
      this.toggleComplete(taskObj.id, span, checkbox)
    );
    deleteBtn.addEventListener("click", () => this.showConfirmModal(li));
    editBtn.addEventListener("click", () => this.editTask(span, taskObj, label));
  }

  toggleComplete(id, span, checkbox) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = checkbox.checked;
      span.classList.toggle("completed", checkbox.checked);
      this.saveTasks();
    }
  }

  showConfirmModal(taskElement) {
    this.taskToDelete = taskElement;
    this.confirmModal.classList.remove("hidden");
  }

  confirmDelete() {
    if (this.taskToDelete) {
      const id = parseInt(this.taskToDelete.dataset.id);
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.saveTasks();
      this.taskToDelete.remove();
      this.taskToDelete = null;
    }
    this.confirmModal.classList.add("hidden");
  }

  cancelDelete() {
    this.taskToDelete = null;
    this.confirmModal.classList.add("hidden");
  }

  editTask(span, taskObj, label) {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = span.textContent;
    inputEdit.className = "form__input";

    const saveEdit = () => {
      const newValue = inputEdit.value.trim();
      if (newValue) {
        span.textContent = newValue;
        const task = this.tasks.find((t) => t.id === taskObj.id);
        if (task) {
          task.text = newValue;
          this.saveTasks();
        }
      }
      label.replaceChild(span, inputEdit);
    };

    inputEdit.addEventListener("blur", saveEdit);
    inputEdit.addEventListener("keypress", (e) => {
      if (e.key === "Enter") saveEdit();
    });

    label.replaceChild(inputEdit, span);
    inputEdit.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => new Todo());
