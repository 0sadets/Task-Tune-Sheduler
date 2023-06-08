window.onload = () => {
  const user = {
                
    userName: "test",
    lastName: "testlast",
    middleName: "jdsk",
    firstName: "ddas",
    birthday: null,
    email: "mailas@gmail.com",
    password: "Qwerty1!"
  }
  fetch(`https://localhost:44322/api/User/register?username=${user.userName}&firstName=${user.firstName}&lastName=${user.lastName}`, {
              method: "POST",
              
            }).then((response) => {
              console.log(response);
              if (response.status == 200) {
               
              }
            });
}

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