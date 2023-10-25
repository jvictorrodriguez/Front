let title = document.getElementById("title");
let signUp= document.getElementById("signUp");
let signIn= document.getElementById("signIn");
let nameInput = document.getElementById("nameInput");




signIn.addEventListener("click",function(event){
    const $username= document.getElementById("username").value;
    if ($username.length==0) {
        alert("vacío");
        event.preventDefault()
    }
    
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

document.getElementById("myAnchor").addEventListener("click", function(event){
    event.preventDefault()
  });