/*************** V A R I A B L E S ********************/
let jwtoken = readCookie("token");
let host = "http://localhost:9090"
let idRegistro;
let dates = {};
let fecha = [];

let $description = document.getElementById("description");
let $date = document.getElementById("date");
let $fechas = document.getElementById("fechas");
let $addDate = document.getElementById("addDate"); //button
let $calendar = document.getElementById("calendar");
let $place = document.getElementById("place");
let $price = document.getElementById("price");
let $tbody=document.getElementById("tbody");

let $enviar = document.getElementById("enviar");
let $modificar = document.getElementById("modificar");

/****************LISTENERS******************/

window.onload = function () {
        obtenerRegistrosDelServidor();
}

$addDate.addEventListener("click", () => {
        addDateToList()
});


$enviar.addEventListener("click", () => {
        altaEvento();
        
});

$modificar.addEventListener("click", () => {
        guardarCambios();

});



/******************** FUNCIONES ******************* */
function addDateToList() {

        $fechas.innerHTML += $calendar.value + "<br>";
        fecha.push($calendar.value);
}




function obtenerRegistrosDelServidor() {

        let ruta = host + "/event/allByUser"

        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var registros = JSON.parse(this.responseText);
                        mostrarRegistros(registros);
                }
        }

}

function mostrarRegistros(registros) {
        let contenidoTabla = "";

        for (const evento of registros) {
                let contenidoFila = `<tr>
                <td>${evento.id}</td>
                <td>${evento.description}</td>
                <td>${evento.date}</td>
                <td>${evento.place}</td>
                <td>${evento.price}</td>
                <td>
                        <i onClick="obtenerUnRegistro(${evento.id})" class="material-symbols-outlined">Edit</i> 
                        <i onClick="borrarRegistro(${evento.id})" class="material-symbols-outlined">Delete</i>
                </td>
                `
                contenidoTabla += contenidoFila;
        }
        $tbody.innerHTML=contenidoTabla;
        //document.querySelector("#tabla tbody").outerHTML = contenidoTabla;
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
        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken)
        xhr.send(JSON.stringify(json))

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var evento = JSON.parse(this.responseText);
                        idRegistro = evento.id;
                        addUserToEvent(idRegistro);
                }
        }


}

function addUserToEvent(idRegistro) {

        let ruta = host + "/event/addUserToEvent/" + idRegistro

        let xhr = new XMLHttpRequest();
        xhr.open("POST", ruta);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var evento = JSON.parse(this.responseText);
                        obtenerRegistrosDelServidor();  
                }
        }
}
function obtenerUnRegistro(id) {

        idRegistro = id;
        let ruta = host + "/event/" + id;


        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        let registro = JSON.parse(this.responseText);
                        mostrarRegistroEnFormulario(registro)
                        cambiarBotones();
                }
        }

}
function mostrarRegistroEnFormulario(evento) {
        $description.value = evento.description;
        $calendar.value = evento.date;
        $place.value = evento.place;
        $price.value = evento.price;
}

function cambiarBotones() {
        $modificar.classList.toggle("hidden");
        $enviar.classList.toggle("hidden");
}

function borrarCampos() {
        $description.value = "";
        $calendar.value = "";
        $place.value = "";
        $price.value = "";
}


function guardarCambios() {

        let ruta = host + "/event/update";

        const json = {
                id: idRegistro,
                description: $description.value,
                date: fecha,
                place: $place.value,
                price: $price.value,
        };


        let xhr = new XMLHttpRequest();
        xhr.open("PUT", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send(JSON.stringify(json))

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        let registro = JSON.parse(this.responseText);
                        obtenerRegistrosDelServidor();
                        cambiarBotones();
                        borrarCampos();
                }
        }
}



function borrarRegistro(id) {

        let ruta = host + "/event/delete/" + id;

        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        obtenerRegistrosDelServidor();
                }
        }
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
