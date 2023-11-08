
function ejecuta() {

        var xhr = new XMLHttpRequest();
        var recibido = "";

        xhr.onload = function () {
                recibido = xhr.json;
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
        for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
}

let listarEventos = async () => {

        let jwtoken = "";
        jwtoken = readCookie("token");
        console.log(jwtoken);


        const peticion = await fetch("http://localhost:9090/event/all",
                {
                        method: "GET",
                        headers: {
                                "Accept": "application/json",
                                "Authorization": "Bearer " + jwtoken
                        }
                });

        const eventos = await peticion.json();

        let contenidoTabla = "";

        for (let evento of eventos) {
                let contenidoFila = `<tr>
            <td>${evento.description}</td>
            <td>${evento.place}</td>
            <td>${evento.price}</td>
            </tr>
            `
                contenidoTabla += contenidoFila;
        }
        console.log("Hemos llegado hasta aquí");
        document.querySelector("#tabla tbody").outerHTML = contenidoTabla;

}
window.onload = function () {
        listarEventos();
    
}