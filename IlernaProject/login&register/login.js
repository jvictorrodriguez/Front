/*************** V A R I A B L E S ********************/

/*  Títulos */
var $title = document.getElementById("title");
/*Botones Radio*/
let $radioLogin = document.getElementById("rlogin");
let $radioRegister = document.getElementById("register");
/*inputs cuadro de texto*/
let $username = document.getElementById("username");
let $email = document.getElementById("email");
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
    reset();
})

$login.addEventListener("click", () => {
    //logInFunction();
    logInJwt()
})

$registro.addEventListener("click", () => {
    registroFunction();
})

$username.addEventListener("blur", (e)=> validarCamposVacios(e));
$email.addEventListener("blur", (e)=> validarCamposVacios(e));
$password.addEventListener("blur", (e)=> validarCamposVacios(e));

$username.addEventListener("focus", (e)=> focus(e));
$email.addEventListener("focus", (e)=> focus(e));
$password.addEventListener("focus", (e)=> focus(e));



/********************  FUNCIONES ********************/
function reset() {
    $username.value = "";
    $email.value = "";
    $password.value = "";
    $mensaje.innerHTML = "";
}

function validarCamposVacios(e){
    const field=e.target;
    const value= field.value;
    if(value.trim().length==0){
       field.classList.add("invalid");
    }else{
        field.classList.remove("invalid");
    }
}

function focus(e){
    const field=e.target;
    const value= field.value;
    field.classList.remove("invalid");
}
function fregister() {
    reset();
    $email.style.maxHeight = "60px";
    $title.innerHTML = $radioRegister.value;
    $registro.classList.remove("disable");
    $registro.classList.add("active");
    $login.classList.add("disable");
    $radioRegister.checked = true;
    
}

function flogin() {
    $email.style.maxHeight = "0px";
    $title.innerHTML = $radioLogin.value;
    $registro.classList.add("disable");
    $login.classList.remove("disable");
    $login.classList.add("active");
    $radioLogin.checked = true;
}

function logInFunction() {

    let auth = btoa(`${$username.value}:${$password.value}`);
    console.log("auth" + auth);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:8080/login', true)
    xhr.setRequestHeader("Authorization", "Basic " + `${auth}`);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status == 200) {
            $mensaje.innerHTML = "Login Correcto";
            sessionStorage.setItem("user", auth);
         
            console.log("get session "+ sessionStorage.getItem("user"));
        }
        else {
            //$mensaje.innerHTML = xhr.status;
            $mensaje.innerHTML = "Usuario y/o Contraseña Incorrecta";
        }
    };
}


function registroFunction() {
    let xhr = new XMLHttpRequest();

    let json = JSON.stringify({
        username: $username.value,
        email: $email.value,
        password: $password.value
    });

    xhr.open("POST", 'http://localhost:9090/api/auth/signup',true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';
    xhr.send(json);
    console.log(json);



    xhr.onload = function () {
        if (xhr.status == 200) {
            $mensaje.innerHTML = "Usuario creado correctamente";
           
        }
        else {
            $mensaje.innerHTML = xhr.status;
            $mensaje.innerHTML = "Error creando al usuario";
        }
    };
}



function logInJwt() {

    

    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:8080/api/auth/signin', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    let json = JSON.stringify({
        username: $username.value,
        email: $fullname.value,
        password: $password.value
    });




    xhr.send(json);

    xhr.onload = function () {
        if (xhr.status == 200) {
            $mensaje.innerHTML = "Login Correcto";
           let response = xhr.responseJSON; 
           console.log(response);
           console.log(JSON.stringify(response));
            
            console.log(response.accessToken);
           
        }
        else {
            //$mensaje.innerHTML = xhr.status;
            $mensaje.innerHTML = "Usuario y/o Contraseña Incorrecta";
        }
    };
}