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
    reset();
})

$login.addEventListener("click", () => {
    //logInFunction();
    logInJwt()
})

$registro.addEventListener("click", () => {
    registroFunction();
})

$fullname.addEventListener("blur", (e)=> validarCamposVacios(e));
$username.addEventListener("blur", (e)=> validarCamposVacios(e));
$password.addEventListener("blur", (e)=> validarCamposVacios(e));

$fullname.addEventListener("focus", (e)=> focus(e));
$username.addEventListener("focus", (e)=> focus(e));
$password.addEventListener("focus", (e)=> focus(e));



/********************  FUNCIONES ********************/
function reset() {
    $fullname.value = "";
    $username.value = "";
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
    nameInput.style.maxHeight = "60px";
    $title.innerHTML = $radioRegister.value;
    $registro.classList.remove("disable");
    $registro.classList.add("active");
    $login.classList.add("disable");
    $radioRegister.checked = true;
    
}

function flogin() {
    nameInput.style.maxHeight = "0px";
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
        fullname: $fullname.value,
        username: $username.value,
        password: $password.value
    });

    xhr.open("POST", 'http://localhost:8080/register',true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';
    xhr.send(json);



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
    const outputElement = document.getElementById('output');

    const apiUrl="http://localhost:8080/api/auth/signin";
    const data = 
        {
            username:"victor",
            password:"Prueba",
        };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      
      fetch(apiUrl, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          //outputElement.textContent = JSON.stringify(data, null, 2);
          var token = data.accessToken;
          outputElement.textContent=token;
        })
        .catch(error => {
          console.error
      
      ('Error:', error);
        });
}