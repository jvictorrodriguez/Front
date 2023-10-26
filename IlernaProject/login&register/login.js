let title = document.getElementById("title");
let signUp = document.getElementById("signUp");
let signIn = document.getElementById("signIn");
let nameInput = document.getElementById("nameInput");

let $username = document.getElementById("username");
let $password = document.getElementById("password");
let $recibido= document.getElementById("recibido");



signIn.addEventListener("click", function (event) {
    const $username = document.getElementById("username").value;
    if ($username.length != 0) {
        
        ejecuta(this.value)

    }

    nameInput.style.maxHeight = "0px";
    title.innerHTML = "Login";
    signUp.classList.add("disable");
    signIn.classList.remove("disable");

   

})

signUp.addEventListener("click", () => {
    nameInput.style.maxHeight = "60px";
    title.innerHTML = "Registro";
    signIn.classList.add("disable");
    signUp.classList.remove("disable");
})




function ejecuta(valor) {
    
    let username=$username.value;
    let password=$password.value;
    //let username="admin";
    //let password="admin";
    let auth= btoa(`${username}:${password}`);

    var xhr = new XMLHttpRequest();
    var recibido = "";

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            recibido = xhr.responseText;
            $recibido.innerHTML = recibido;
            console.log(recibido);
            alert(recibido);
        }
    }

    xhr.open("GET","http://localhost:9001/login", true);
    xhr.setRequestHeader("Authorization", "Basic " + `${auth}`);
    xhr.send();
    

}

