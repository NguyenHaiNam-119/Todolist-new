<<<<<<< HEAD
// Lap trinh OOP, lap class Todo, vut het function vao trong (Date) => Tach biet xu ly logic voi phan xu ly DOM
// Contribute Todo la 1 array, lam sao de update giao dien (Date)
// Edit thi thanh o input (x)
// Luu het vao Local 
// Bat nhap ten truoc roi luu vao local, todo gan voi ten day 
// Sign out thi phai nhap ten moi, khi vao trung ten da co data thi hien ra data, coi local la DB
// Dat ten class trong CSS theo BEM (x)
// Viet valid function, truyen username rule, han che if else, truyen valid de test required 
// Neu co 2 id trung nhau thi ham getElement chay ntn, neu loi thi bao loi gi, mac loi o buoc nao (x)
// Moi lan addTask thi phai getEle 1 lan, co cach nao chi can goi 1 lan hay kh?
// Tim hieu cach trinh duyet load file html ntn, thuc thi nhung gi (x)
// Dua the script len head, van muon su dung duoc thi them gi vao body (x)
// Thay localStorage thanh API


const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo__list");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const task = input.value.trim();
  if (task !== "") {
    addTask(task);
    input.value = "";
  }
});

function addTask(task) {
  const li = document.createElement("li");
  li.className = "task";

  const label = document.createElement("label");
  label.className = "task__label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.className = "task__text";
  span.textContent = task;

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
  });

  deleteBtn.addEventListener("click", () => {
    li.remove();
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
        label.replaceChild(span, inputEdit);
      } else {
        label.replaceChild(span, inputEdit); // nếu rỗng thì giữ nguyên
      }
    }

    inputEdit.addEventListener("blur", saveEdit);
    inputEdit.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        saveEdit();
      }
    });
  });
}
=======
class Todo {
  constructor() {
    this.form = document.getElementById("todo-form");
    this.input = document.getElementById("todo-input");
    this.list = document.getElementById("todo__list");

    this.confirmModal = document.getElementById("confirmModal");
    this.confirmYes = document.getElementById("confirmYes");
    this.confirmNo = document.getElementById("confirmNo");

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

    checkbox.addEventListener("change", () => this.toggleComplete(taskObj.id, span, checkbox));
    deleteBtn.addEventListener("click", () => this.showConfirmModal(li));
    editBtn.addEventListener("click", () => this.editTask(span, taskObj, label));
  }

  toggleComplete(id, span, checkbox) {
    const task = this.tasks.find(t => t.id === id);
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
      this.tasks = this.tasks.filter(t => t.id !== id);
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
        const task = this.tasks.find(t => t.id === taskObj.id);
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
>>>>>>> newest
