let $username = document.getElementById("username");
let $password = document.getElementById("password");
let $button=document.getElementById("submit");
let $resultado= document.getElementById("resultado");


 


function ejecuta(){

    let username=$username.value;
    let password=$password.value;
    let auth= btoa(`${username}:${password}`);
    //let auth=btoa(`${$username.value}:${$password.value}`);
    var xhr = new XMLHttpRequest();    
    var recibido = "";

    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status==200){
            recibido= xhr.responseText;
           $resultado.innerHTML = recibido;
        }
    }

    xhr.open("GET","http://localhost:9001/login", true);
    xhr.setRequestHeader("Authorization", "Basic " + `${auth}`);
    xhr.send();
    

    headers.innerHTML= xhr.getAllResponseHeaders();


}

    

$button.addEventListener("click",()=>{
    ejecuta();
});

document.addEventListener('keyup', function(event){
    if(event.key=='Enter') ejecuta();
})


