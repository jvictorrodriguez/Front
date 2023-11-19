// Importa los elementos del DOM 
//import * as DOM from "./domElement.js";


/*************** V A R I A B L E S ********************/
let jwtoken = readCookie("token");
let host = "http://localhost:9090"
let arrayEventos; // json con todos los eventos suscritos por el usuarios logueado

//let username;
let usuarioObj;
let idRegistro;
let dates = {};
let fecha = [];
let idUsuario;






const rutaObtenUsername= host+ "/user";


//let companions;


/****************LISTENERS******************/
window.onload = function () {
        getUsername();
        //console.log(usuarioObj.username);
        //      obtenerRegistrosTusEventosDelServidor();
        //obtenerPersonasUsuario();
}

//LISTENERS BUSCAR EVENTOS
DOM.$botonBuscarEventos.addEventListener("click", () => {
        buscarEventosPorCorreo();
})

//LISTENERS TUS EVENTOS
DOM.$addDate.addEventListener("click", () => {
        addDateToList()
});

DOM.$enviarTuEvento.addEventListener("click", () => {
        altaEvento();
});

DOM.$modificarTuEvento.addEventListener("click", () => {
        guardarCambios();
});



/****************FUNCIONES******************/

export function callApi(ruta){

        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        return JSON.parse(this.responseText);
                }
        }   
}


function getUsername() {
        const ruta = host + "/user";

        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        usuarioObj = JSON.parse(this.responseText);
                }
        }
}
function saludo(){
        username = usuarioObj.username;
        DOM.$saludo.innerHTML += username;
}
//BUSCAR EVENTOS
function buscarEventosPorCorreo() {

        let ruta = host + "/event/search?email=" + DOM.$emailBuscarEventos.value;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var registros = JSON.parse(this.responseText);

                        let contenidoTabla = "";
                        for (const evento of registros) {
                                let contenidoFila =
                                        //<td>${evento.id}</td>
                                        `<tr>
                                <td>${evento.description}</td>
                                <td>${evento.date}</td>
                                <td>${evento.place}</td>
                                <td>${evento.price}</td>
                        `
                                contenidoFila += `<td>
                                        <i onClick=" addUserToEvent(${evento.id})" 
                                        class="material-symbols-outlined">Add</i> 
                                        
                                </td>
                                `
                                contenidoTabla += contenidoFila;
                        }
                        DOM.$tbodyBusqueda.innerHTML = contenidoTabla;
                }
        }
}


//FUNCIONES TUS EVENTOS
function addDateToList() {
        DOM.$fechas.innerHTML += $calendar.value + "<br>";
        fecha.push(DOM.$calendar.value);
}

function obtenerRegistrosTusEventosDelServidor() {

        const ruta = host + "/event/allByUser"

        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var registros = JSON.parse(this.responseText);
                        arrayEventos = registros;
                        mostrarRegistrosTusEventos(registros);
                }
        }
}


function mostrarRegistrosTusEventos(registros) {
        let contenidoTabla = "";
        for (const evento of registros) {
                let rruta= "demo_form.php?name1=value1&name2=value2";
                let contenidoFila = `<tr>
                <td><a href="eventoDetalle.html"+"?"+"id"+ ${evento.id}>

                
                ${evento.description}</td>
                </a>
                <td>${evento.date}</td>
                <td>${evento.place}</td>
                <td>${evento.price}</td>
                <td>${evento.creator.username}</td>
                <td>`
                for (const person of evento.companions) {
                        contenidoFila += person.name + " ";
                }
                
                contenidoFila += `
                </td>
                
                <td>
                        <i onClick="obtenerUnRegistro(${evento.id})" class="material-symbols-outlined">Edit</i> 
                        <i onClick="borrarRegistro(${evento.id})" class="material-symbols-outlined">Delete</i>
                </td>
                `
                contenidoTabla += contenidoFila;
        }
        DOM.$tbodyTusEventos.innerHTML = contenidoTabla;
}

function altaEvento() {

        const ruta = host + "/event";

        const json = {
                description: $description.value,
                date: fecha,
                place: $place.value,
                price: $price.value,
                companions: arrayViajerosDTO,
                creator: usuarioObj
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", ruta)
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

        const ruta = host + "/event/addUserToEvent/" + idRegistro

        let xhr = new XMLHttpRequest();
        xhr.open("POST", ruta);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var evento = JSON.parse(this.responseText);
                        obtenerRegistrosTusEventosDelServidor();
                        borrarCampos();
                }
        }
}
function obtenerUnRegistro(id) {
        DOM.$tituloOpcionEvento.innerHTML = "Modificar";

        idRegistro = id;
        const ruta = host + "/event/" + id;


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
        //Recibimos el objeto evento. Se trata de un único evento
        //Mostramos en el formulario los campos del evento
        DOM.$description.value = evento.description;
        DOM.$calendar.value = evento.date;
        DOM.$place.value = evento.place;
        DOM.$price.value = evento.price;
        DOM.$asistentes.innerHTML = "";
        
        let checkAsistentes = "";
        for (const person of evento.companions) {
                checkAsistentes += `
                <input type="checkbox" name="companions" id="${person.name}" value="${person.id}" checked>
                <label for=${person.name}>${person.name}</label>`
        }
        DOM.$asistentes.innerHTML = checkAsistentes;
        activarCheckTablaArrayPersonas(evento);

}






function cambiarBotones() {
        DOM.$borrarTuEvento.classList.toggle("hidden");
        DOM.$modificarTuEvento.classList.toggle("hidden");
        DOM.$enviarTuEvento.classList.toggle("hidden");
}

function borrarCampos() {
        DOM.$description.value = "";
        DOM.$calendar.value = "";
        DOM.$place.value = "";
        DOM.$price.value = "";
        DOM.fecha = [];
        DOM.$fechas.innerHTML = "";
        DOM.$asistentes.innerHTML = "";
        DOM.$checkboxesBDPersonas

}


function guardarCambios() {

        const ruta = host + "/event/update";

        const json = {
                id: idRegistro,
                description: $description.value,
                date: fecha,
                place: $place.value,
                price: $price.value,
                companions: arrayViajerosDTO
        };


        let xhr = new XMLHttpRequest();
        xhr.open("PUT", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        console.log(JSON.stringify(json));
        xhr.send(JSON.stringify(json));

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        let registro = JSON.parse(this.responseText);
                        obtenerRegistrosTusEventosDelServidor();
                        cambiarBotones();
                        borrarCampos();
                        $tituloOpcionEvento.innerHTML = "Añadir";
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
                        obtenerRegistrosTusEventosDelServidor();
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





function activarCheckTablaArrayPersonas(evento) {

        let $arrayCheckPersonas = document.getElementsByName("listaPersonasBD");
        let numeroPersonasBD = $arrayCheckPersonas.length;

        for (const personaEnEvento of evento.companions) {
                for (var i = 0; i < arrayPersonas.length; i++) {
                        if (personaEnEvento.id == arrayPersonas[i].id)
                                $arrayCheckPersonas[i].checked = true;
                }
        }

}

function incluirPersonaAEvento() {

        DOM.$checkboxesBDPersonas = document.getElementsByName('listaPersonasBD');
        DOM.$asistentes.innerHTML = "";
        arrayViajerosDTO = [];
        let checkAsistentes="";
        for (var checkbox of $checkboxesBDPersonas) {
                if (checkbox.checked) {
                        let codigo= checkbox.value;
                        arrayViajerosDTO.push(arrayPersonas[codigo]);
                        
                        checkAsistentes += `
                        <input type="checkbox" name="companions" id="${arrayPersonas[codigo].name}" value="${arrayPersonas[codigo].id}" checked>
                        <label for=${arrayPersonas[codigo].name}>${arrayPersonas[codigo].name}</label>`
                        }
                        DOM.$asistentes.innerHTML = checkAsistentes;
                        
                }
        }

