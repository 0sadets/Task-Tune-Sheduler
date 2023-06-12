let currentUser = {};
function outputtingDate(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
window.onload = () => {
  if(localStorage.getItem("email") != null){
    console.log(localStorage.getItem("email"));
    document.querySelector(".loginBtn").classList.add("d-none");
  }
  else{
    document.querySelector(".menuIsLogin").classList.add("d-none");
    document.querySelector(".noLoginBtn").classList.add("d-none");
  }

  fetch(`https://localhost:44322/api/User/get-user-by-email?email=${localStorage.getItem("email")}`)
    .then((response) => response.json())
    .then((user) => {
      currentUser = {
        id: user.id,
        username: user.userName,
        lastname: user.lastName,
        middlename: user.middleName,
        firstname: user.firstName,
        email: user.email,
        birthday: new Date(
          `${user.birthday?.substring(0, user.birthday.indexOf("T"))}`
        ),
      };
      console.log(currentUser);
      document.querySelector(".username").innerText = currentUser.username;
      document.querySelector(".pib").innerText = `${currentUser.lastname} ${currentUser.firstname} ${currentUser.middlename}`;
      document.querySelector(".email").innerText = currentUser.email;
      document.querySelector(".bday").innerText = outputtingDate(currentUser.birthday);
    });
};
document.querySelector("#logOut").addEventListener("click", () =>{
  localStorage.clear();
})