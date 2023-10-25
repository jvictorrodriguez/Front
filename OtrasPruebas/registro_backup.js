let $username = document.getElementById("username");
let $password = document.getElementById("password");
let $button=document.getElementById("submit");

 


function ejecuta(){
    var xhr = new XMLHttpRequest();
    var recibido = "";

    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status==200){
            recibido= xhr.responseText;
           resultado.innerHTML = recibido;
        }
    }

    xhr.open("GET","http://localhost:9000/login", true ,$username, $password);
    xhr.send();
    xhr.getAllResponseHeaders();

}

    

$button.addEventListener("click",()=>{
    
    let auth=btoa(`${$username.value}:${$password.value}`);
    ejecuta();

});



