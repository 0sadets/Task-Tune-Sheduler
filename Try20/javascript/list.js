let todos = [];
window.onload = () => {
  loadTodos();
};
function loadTodos() {
  todos.length = 0;
  fetch("https://localhost:44322/api/User/get-no-date-note")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        todos.push({
          id: item.id,
          title: item.title,
          status: item.status,
          user: item.user,
        });
      });
      showTodo("all");
    });
}

const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");
let editId,
  isEditTask = false;
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  taskBox.innerHTML = "";
  console.log(filter);
  if (todos != null) {
    todos.forEach((todo) => {
      // let completed = todo.status == "completed" ? "checked" : "";
      console.log(typeof todo.status.toString());
      if (filter == todo.status.toString() || filter == "all") {
        console.log(todo);
        let li = document.createElement("li");
        li.className = "task";
        let label = document.createElement("label");
        label.htmlFor = todo.id;
        let input = document.createElement("input");
        input.type = "checkbox";
        let p = document.createElement("p");
        if (todo.status) {
          input.setAttribute("disabled", "disabled");
          p.style.textDecoration = "line-through";
        }
        input.addEventListener("click", () => {
          fetch(`https://localhost:44322/api/User/set-status?id=${todo.id}`, {
            method: "POST",
          }).then((response) => {
            if (response.status == 200) {
              p.style.textDecoration = "line-through";
              input.setAttribute("disabled", "disabled");
              loadTodos();
            }
          });
        });

        input.value = todo.title;
        p.innerText = todo.title;
        label.append(input);
        label.append(p);
        let div = document.createElement("div");
        div.className = "settings";
        let i = document.createElement("i");
        i.className = "uil uil-ellipsis-h";
        let ul = document.createElement("ul");
        ul.className = "task-menu";
        let ulli = document.createElement("li");
        ulli.innerHTML = "<i class='uil uil-pen'></i>";
        ulli.value = "edit";
        let ulli2 = document.createElement("li");
        ulli2.innerHTML = "<i class='uil uil-trash'></i>";
        ulli2.value = "delete";
        ul.append(ulli);
        ul.append(ulli2);
        div.append(i);
        div.append(ul);
        li.append(label);
        li.append(div);
        taskBox.append(li);
      }
    });
  } else {
    taskBox.innerHTML = `<span >У вас ще немає завдань</span>`;
  }
  let checkTask = taskBox.querySelectorAll(".task");
  if(taskBox.children.length == 0){
    taskBox.innerHTML = `<span id="">У вас ще немає завдань</span>`;
  }
}

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = true;
    fetch(`https://localhost:44322/api/User/set-status?id=${selectedTask.id}`, {
      method: "POST",
    }).then((response) => {});
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = false;
  }
}
function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}
function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  showTodo(filter);
}
clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  showTodo();
});
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value;
  if (e.key == "Enter" && userTask) {
    taskInput.value = "";
    fetch(`https://localhost:44322/api/User/add-no-date-note?title=${userTask}&user=sashaosadets@gmail.com`, {
      method: "POST",
    }).then((response) => {
      loadTodos();
      console.log(response);
    });
    
  }
});
