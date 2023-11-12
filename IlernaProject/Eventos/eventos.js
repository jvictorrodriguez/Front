/*************** V A R I A B L E S ********************/
let jwtoken = readCookie("token");
let host = "http://localhost:9090"
let eventId;

let $description = document.getElementById("description");
let $date = document.getElementById("date");
let $fechas=document.getElementById("fechas");
let $addDate= document.getElementById("addDate"); //button
let $place = document.getElementById("place");
let $price = document.getElementById("price");


let dates={};
let fecha=[];

let $enviar = document.getElementById("enviar");

/****************LISTENERS******************/

window.onload = function () {
        listarEventos();
}

$addDate.addEventListener("click",()=>{
        addDateToList()
    });
    

$enviar.addEventListener("click", ()=> {
        altaEvento();
})



function addDateToList(){    

        $fechas.innerHTML+=calendar.value +"<br>";
        fecha.push(calendar.value);
}



function addUserToEvent(){

        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", host + "/addUserToEvent/"+eventId)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader( 'Authorization', 'Bearer ' + jwtoken)
        xhr.send(JSON.stringify(json))

}

function altaEvento() {

        const json = {
                description: $description.value,
                date: fecha,
                place: $place.value,
                price: $price.value,
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", host + "/event")
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader( 'Authorization', 'Bearer ' + jwtoken)


        // send rquest with JSON payload
        xhr.send(JSON.stringify(json))

        //necesito recuperar el id para almacenarlo en eventId;
}



let listarEventos = async () => {

        jwtoken = readCookie("token");

        const peticion = await fetch("http://localhost:9090/event/allByUser",
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
                <td>${evento.id}</td>
                <td>${evento.description}</td>
                <td>${evento.date}</td>
                <td>${evento.place}</td>
                <td>${evento.price}</td>
            </tr>
            `;
                contenidoTabla += contenidoFila;
        }

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
