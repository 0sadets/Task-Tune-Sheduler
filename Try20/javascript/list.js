const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");
let editId,
isEditTask = false;
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});


let todos = [];
window.onload = () => {
  fetch("https://localhost:44322/api/User/get-notes")
    .then((response) => response.json())
    .then((data) => {
      data.forEach(item => {
        todos.push({
          id: item.id,
          title: item.title,
          status: item.status,
          user: item.user
        });
        // document.querySelector(".currentUser").value = data[0].user;
        // console.log(data[0].user);
      });
    });
console.log(todos);
showTodo(document.querySelector("span.active").id);

};




function showTodo(filter) {
    
    if(todos != null) {
        todos.forEach((todo) => {
            // let completed = todo.status == "completed" ? "checked" : "";
            console.log(todo);
            // if(filter == todo.status || filter == "all") {
                // liTag += `<li class="task">
                //             <label for="${todo.id}">
                //                 <input onclick="updateStatus(this)" type="checkbox" id="${todo.id}" ${completed}>
                //                 <p class="${completed}">${todo.title}</p>
                //             </label>
                //             <div class="settings">
                //                 <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                //                 <ul class="task-menu">
                //                     <li onclick='editTask(${todo.id}, "${todo.title}")'><i class="uil uil-pen"></i>Редагувати</li>
                //                     <li onclick='deleteTask(${todo.id}, "${filter}")'><i class="uil uil-trash"></i>Видалити</li>
                //                 </ul>
                //             </div>
                //         </li>`;
                        let li = document.createElement("li");
                        li.className = "task";
                        let label = document.createElement("label");
                        label.htmlFor = todo.id;
                        let input = document.createElement("input");
                        input.type = "checkbox";
                        input.id = todo.id;
                        let p = document.createElement("p");
                        p.className = completed;
                        input.value = todo.title;
                        p.value = todo.title;
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

                        
            // }

        });
    }
    else{
        taskBox.innerHTML = `<span >У вас ще немає завдань</span>`;
    }
    // let checkTask = taskBox.querySelectorAll(".task");
    // !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    // taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
    
}
showTodo("all");
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
        fetch(`https://localhost:44322/api/User/set-status?id=${selectedTask.id}`, { method: 'POST' }
        )
          .then((response) => {
            if (response.status == 200) {
              titleEv.style.textDecoration = 'line-through'
            }
          });
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
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
    showTodo()
});
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {title: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].title = userTask;
        }
        taskInput.value = "";

        showTodo(document.querySelector("span.active").id);
    }
});