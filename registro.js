let $username = document.getElementById("username");
let $password = document.getElementById("password");
let $button=document.getElementById("submit");


 


function ejecuta(){
    let username=$username.value;
let password=$password.value;
let auth= btoa(`${username}:${password}`);
console.log("username: "+ username)
console.log("password: "+ password)
    var xhr = new XMLHttpRequest();    
    var recibido = "";


    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status==200){
            recibido= xhr.responseText;
           resultado.innerHTML = recibido;
        }
    }

    xhr.open("GET","http://localhost:9000/login", true);
    //xhr.setRequestHeader("Authorization", "Basic" + btoa('${$username}:${$password}'));
    xhr.setRequestHeader("Authorization", "Basic " + `${auth}`);
    xhr.send();
    xhr.getAllResponseHeaders();
    console.log("auth: "+auth);

}

    

$button.addEventListener("click",()=>{
    
    let auth=btoa(`${$username.value}:${$password.value}`);
    ejecuta();

});


