/*************** V A R I A B L E S ********************/

/*  Títulos */
var $title = document.getElementById("title");
/*Botones Radio*/
let $radioLogin = document.getElementById("rlogin");
let $radioRegister = document.getElementById("register");
/*inputs cuadro de texto*/
let $fullname = document.getElementById("fullname");
let $username = document.getElementById("username");
let $password = document.getElementById("password");
/*p mensaje desde server al login*/
let $mensaje = document.getElementById("mensaje");
/*Botones*/
let $borrar = document.getElementById("borrar");
let $login = document.getElementById("login");
let $registro = document.getElementById("registro");

/****************LISTENERS******************/

$radioLogin.addEventListener("click", () => {
    flogin();
})

$radioRegister.addEventListener("click", () => {
    fregister();
})

$borrar.addEventListener("click", () => {
    $mensaje.innerHTML = "";
})

$login.addEventListener("click", () => {
    logInFunction(this.value)
})

$registro.addEventListener("click", () => {
    sendFile();
})

/********************  FUNCIONES ********************/
function reset() {
    $fullname.value = "";
    $username.value = "";
    $password.value = "";
    $mensaje.value = "";
}

function fregister() {
    nameInput.style.maxHeight = "60px";
    $title.innerHTML = $radioRegister.value;
    $registro.classList.remove("disable");
    $registro.classList.add("active");
    $login.classList.add("disable");
    $radioRegister.checked=true;
}

function flogin() {
    nameInput.style.maxHeight = "0px";
    $title.innerHTML = $radioLogin.value;
    $registro.classList.add("disable");
    $login.classList.remove("disable");
    $login.classList.add("active");
    $radioLogin.checked=true;
}

function logInFunction() {

    let auth = btoa(`${$username.value}:${$password.value}`);
    console.log("auth" + auth);
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
            $mensaje.innerHTML = "Correo y/o contraseña incorrectos";
        }
    }
    xhr.open("POST", "http://localhost:8080/login", true);
    xhr.setRequestHeader("Authorization", "Basic " + `${auth}`);
    xhr.send();
}

/******************************************* */

let sendFile = async () => {

    const usuarioDto = {
        fullname: $fullname.value,
        username: $username.value,
        password: $password.value
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