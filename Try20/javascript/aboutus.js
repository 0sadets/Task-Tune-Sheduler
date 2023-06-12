window.onload = () => {
  if(localStorage.getItem("email") != null){
    console.log(localStorage.getItem("email"));
    document.querySelector(".loginBtn").classList.add("d-none");
  }
  else{
    document.querySelector(".menuIsLogin").classList.add("d-none");
    document.querySelector(".noLoginBtn").classList.add("d-none");
  }
}
document.querySelector("#logOut").addEventListener("click", () =>{
  localStorage.clear();
})