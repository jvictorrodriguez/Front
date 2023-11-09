/*************** V A R I A B L E S ********************/
 token="";
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
    logInJwt();
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
    mailbox.style.maxHeight = "60px";
    $title.innerHTML = $radioRegister.value;
    $registro.classList.remove("disable");
    $registro.classList.add("active");
    $login.classList.add("disable");
    $radioRegister.checked = true;
    
}

function flogin() {
    mailbox.style.maxHeight = "0px";
    $title.innerHTML = $radioLogin.value;
    $registro.classList.add("disable");
    $login.classList.remove("disable");
    $login.classList.add("active");
    $radioLogin.checked = true;
}


function registroFunction() {

    const apiUrl = 'http://localhost:9090/api/auth/signup';
    const data = {
        username: $username.value,
        email: $email.value,
        password: $password.value
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
        /*if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        */
        return response.json();
      })
      .then(data => {
        $mensaje.textContent = JSON.stringify(data.message, null, 2);
      })
      .catch(error => {
       // console.error ('Error:', error);
       $mensaje.textContent = JSON.stringify(data.message, null, 2);
       console.log("error");
      });
}



function logInJwt() {

    const apiUrl = 'http://localhost:9090/api/auth/signin';
    const data = {
        username: $username.value,
        password: $password.value
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
        $mensaje.textContent = JSON.stringify(data.id, null, 2);
        token=data.accessToken;
        
        
        document.cookie = "token="+token;
       
      
        window.open("./Eventos/eventos.html")

        
        })
        .catch(err => {
          console.error('Error recibido en la solicitud:', err);
        });
}
