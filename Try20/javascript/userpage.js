

function loadTodos() {
  fetch("https://localhost:44322/api/User/get-no-date-note")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        todos.push({
          id: user.id,
          username: user.username,
          lastname: user.lastname,
          middlename: user.middlename,
          email: user.email,
          birthday: user.birthday
        });
      });
      showTodo("all");
    });
  }