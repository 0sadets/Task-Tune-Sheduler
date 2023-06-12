document.querySelector(".signinbtn").addEventListener("click", () => {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#psw").value;
  console.log(email);
  fetch(
    `https://localhost:44322/api/User/login?email=${email}&password=${password}`,
    {
      method: "POST",
    }
  ).then((response) => {
    console.log(response);
    if (response.status == 200) {
      localStorage.setItem("email", email);
      window.location.href = "../pages/userpage.html";
    }
  });
})