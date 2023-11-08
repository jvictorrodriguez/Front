window.onload = function(){
ejecuta();

}
let resultado= document.getElementById("resultado");

function ejecuta(){

        var xhr = new XMLHttpRequest();
        var recibido="";

        xhr.onload= function(){
                recibido=xhr.json;
                resultado.innerHTML = recibido;

        }
        let jwtoken = readCookie("token");
        xhr.open("GET", "http://localhost:9090/event/all");
        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}