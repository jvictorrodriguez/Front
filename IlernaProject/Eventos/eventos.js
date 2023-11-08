/*************** V A R I A B L E S ********************/
let jwtoken="";



window.onload = function () {
        listarEventos();
    
}




let listarEventos = async () => {

        
        jwtoken = readCookie("token");

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


function readCookie(name) {
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