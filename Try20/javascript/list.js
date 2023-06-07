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
      document.querySelector("span.active").classList.remove("active");
      document.querySelector("#all").classList.add("active");
    });
  }

  function showTodo(filter) {
    taskBox.innerHTML = "";
    console.log(filter);
    if (todos != null) {
      console.log(todos);
      todos.forEach((todo) => {
        if (filter == todo.status.toString() || filter == "all") {
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
          if(todo.status.toString() == "true"){
            i.style.display = "none";
          }
          let ul = document.createElement("ul");
          ul.className = "task-menu";
          let ulli = document.createElement("li");
          ulli.innerHTML = "<i class='uil uil-pen'></i>Редагувати";
          ulli.addEventListener("click", () => openEdit(todo));
          let ulli2 = document.createElement("li");
          ulli2.innerHTML = "<i class='uil uil-trash'></i>Видалити";
          ulli2.addEventListener("click", ()=> deleteTask(todo));
          ul.append(ulli);
          i.addEventListener("click", () => showMenu(ul));
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
    if (taskBox.children.length == 0) {
      taskBox.innerHTML = `<span id="">У вас ще немає завдань</span>`;
    }
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


function showMenu(selectedTask) {
  // console.log(selectedTask.parentElement);
  // let menuDiv = selectedTask.parentElement.lastElementChild;
  selectedTask.classList.add("show");
  console.log(selectedTask);
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I") {
      selectedTask.classList.remove("show");
    }
  });
}

function openEdit(task) {
  // $("#editModal").modal();
  document.getElementById("editModal").style.display = "block";
  document.getElementById("editModal").classList.add("show");
  document.getElementById("todo-title").value = task.title;
  document.getElementById("todo-submit").addEventListener("click", () => {
    fetch(
      `https://localhost:44322/api/User/edit-no-date-note?id=${task.id}&title=${
        document.getElementById("todo-title").value
      }`,
      {
        method: "POST",
      }
    ).then((response) => {
      // console.log(document.querySelector("span.active").id);
      if (response.status == 200) {
        document.getElementById("editModal").style.display = "none";
        document.getElementById("editModal").classList.remove("show");
        loadTodos();
        
      }
    });
  });
}
function deleteTask(task) {
  fetch(`https://localhost:44322/api/User/delete-no-date-note-by-id?id=${task.id}`, {
    method: "POST",
  }).then((response) => {
    loadTodos();
    console.log(response);
    if(response.status == 200){
alert(`Ви видалили ${task.title}.`);
    }
  });
}

clearAll.addEventListener("click", () => {
  fetch(`https://localhost:44322/api/User/delete-all-no-date`, {
    method: "POST",
  }).then((response) => {
    loadTodos();
    console.log(response);
  });
});
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value;
  if (e.key == "Enter" && userTask) {
    taskInput.value = "";
    fetch(
      `https://localhost:44322/api/User/add-no-date-note?title=${userTask}&user=sashaosadets@gmail.com`,
      {
        method: "POST",
      }
    ).then((response) => {
      loadTodos();
      console.log(response);
    });
  }
});
