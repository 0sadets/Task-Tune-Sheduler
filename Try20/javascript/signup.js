window.onload = () => {};
document.querySelector(".registerbtn").addEventListener("click", () => {
  var date = new Date(document.querySelector("#birthday").value);
  let birthday = `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()}`;
  const user = {
    userName: document.querySelector("#username").value,
    lastName: document.querySelector("#lastname").value,
    middleName: document.querySelector("#middlename").value,
    firstName: document.querySelector("#firstname").value,
    birthday: birthday,
    email: document.querySelector("#email").value,
    password: document.querySelector("#psw").value
  };
console.log(user);
  fetch(
    `https://localhost:44322/api/User/register?username=${user.userName}&firstName=${user.firstName}&lastName=${user.lastName}&middleName=${user.middleName}&email=${user.email}&birthday=${user.birthday}&password=${user.password}`,
    {
      method: "POST",
    }
  ).then((response) => {
    console.log(response);
    if (response.status == 200) {
      localStorage.setItem("email", user.email);
      window.location.href = "../pages/userpage.html";
    }
  });
});
