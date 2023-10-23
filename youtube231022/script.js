let signUp= document.getElementById("signUp");
let signIn= document.getElementById("signIn");
let nameInput = document.getElementById("nameInput");
let title = document.getElementById("title");

signIn.addEventListener("click", ()=>{
    nameInput.style.maxHeight="0px";
    title.innerHTML="Login";
    signUp.classList.add("disable");
    signIn.classList.remove("disable");
})

signUp.addEventListener("click", ()=>{
    nameInput.style.maxHeight="60px";
    title.innerHTML="Registro";
    signIn.classList.add("disable");
    signUp.classList.remove("disable");
})