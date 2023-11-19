const jwtoken = readCookie("token");
const host = "http://localhost:9090";
const rutaObtenerUnEvento= host + "/event/" //  + id;

window.onload= function(){
    let params = new URLSearchParams(window.location.search);
    let miParametro = params.get("id");
    console.log(miParametro);
    obtenerUnEvento(miParametro);
}




function obtenerUnEvento(idEvento) {

    const ruta= rutaObtenerUnEvento + idEvento;
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
    xhr.send();
    

    xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                    let evento = JSON.parse(this.responseText);
mostrarInfo(evento);
                 //   mostrarRegistroEnFormulario(registro)
                 //   cambiarBotones();
                  //  activarCheckTablaArrayPersonas(registro);//TODO
            }
    }
    //idRegistro = idEvento;
    //DOM.$tituloOpcionEvento.innerHTML = "Modificar";
}

function mostrarInfo(evento){
    const parrafo=document.getElementById("pevento");
        
    let detalleEvento =`${evento.id} 
    ${evento.description}
    ${evento.status}
        ${evento.date}
            ${evento.price}`;

            for (const participante of evento.companions) {
            detalleEvento+=`${participante.name}`;
            }
            detalleEvento+=`
            ${evento.forum.description}
            ${evento.forum.description}
            `
            for (const post of evento.forum.postList) {
               detalleEvento+= `${post.description}`;
            }
        parrafo.innerHTML=detalleEvento;
    }
            





//=================== COOKIES ===================
export function readCookie(name) {
    //webgrafia https://www.quirksmode.org/js/cookies.html#script
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}