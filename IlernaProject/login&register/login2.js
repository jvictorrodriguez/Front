

$username = document.getElementById("username").value;
$password = document.getElementById("password").value;


let title = document.getElementById("title");
let signUp = document.getElementById("signUp");
let signIn = document.getElementById("signIn");
let nameInput = document.getElementById("nameInput");
let $name = document.getElementById("name");
let $username = document.getElementById("username");
let $password = document.getElementById("password");
let $mensaje = document.getElementById("error");

$name.addEventListener("click", () => {
    if ($mensaje.length > 0) {
        $name.innerHTML = "";
    }
    $mensaje.innerHTML = "";
})

$username.addEventListener("click", () => {
    $mensaje.innerHTML = "";
})
$password.addEventListener("click", () => {
    $mensaje.innerHTML = "";
})


signIn.addEventListener("click", () => {

    const $username = document.getElementById("username").value;
    if ($username.length != 0) {
        logInFunction(this.value)
    }
    nameInput.style.maxHeight = "0px";
    title.innerHTML = "Login";
    signUp.classList.add("disable");
    signIn.classList.remove("disable");
})

signUp.addEventListener("click", () => {
    nameInput.style.maxHeight = "60px";
    title.innerHTML = "Registro";

    if ($mensaje.innerHTML.length > 0) {
        alert($mensaje.innerHTML);
        $name.value = "";
        $username.value = "";
        $password.value = "";

    }
    $mensaje.innerHTML = "";
    signIn.classList.add("disable");
    signUp.classList.remove("disable");
    
    sendFile();
})




function logInFunction(valor) {

    let username = $username.value;
    let password = $password.value;
    let auth = btoa(`${username}:${password}`);

    var xhr = new XMLHttpRequest();
    var recibido = "";

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            recibido = xhr.responseText;
            if (recibido.length > 0) {
                $mensaje.innerHTML = recibido;
            }
        }

        if (this.status == 401) {
            $mensaje.innerHTML = "Contraseña errónea";
        }
    }

    xhr.open("GET", "http://localhost:8080/login", true);
    xhr.setRequestHeader("Authorization", "Basic " + `${auth}`);
    xhr.send();


}



    let sendFile = async () => {

        alert("FunctionRegistro")
        let username = $username.value;
        let password = $password.value;
        let fullName = $name.value;
    

        const usuarioDto = {
            fullname: fullName,
            username: username,
            password: password
        }



        console.log(JSON.stringify(usuarioDto));





        const peticion = await fetch("http://localhost:8080/register",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioDto)
            });



    }


