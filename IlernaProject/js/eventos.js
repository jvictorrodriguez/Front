// Importa los elementos del DOM 
import * as DOM from "./domElement.js";


/*************** V A R I A B L E S ********************/
const jwtoken = readCookie("token");
const host = "http://localhost:9090"

let usuarioObj;
let fecha = []; 
let idRegistro;
let listaEventosPorCorreo;
let arrayEventosDelUsuario;
let arrayParticipantesDTO;



//=========== Rutas EndPoints Server====================
const rutaGetUsername= host + "/user";
const rutaBuscarEventosPorCorreo =  host + "/event/search?email="
const rutaObterEventosUsuarioDelServidor= host + "/event/allByUser";
const rutaAltaEvento = host + "/event";
const rutaAnadirUsuarioAlEvento = host + "/event/addUserToEvent/" // + id
const rutaObtenerUnEvento= host + "/event/" //  + id;
const rutaModificarUnEvento = host + "/event/update";
const rutaBorrarEvento = host + "/event/delete/" //+ id;

//==================================================
//=========== L I S T E N E R S ====================
//==================================================
window.onload = function () {
    getUsername();   //Función asíncrona que llamará a saludo cuando reciba el nombre del usuario
    obtenerEventosDelUsuarioDesdeElServidor();
    obtenerPersonasUsuario();
}

//LISTENERS BUSCAR EVENTOS
DOM.$botonBuscarEventos.addEventListener("click", () => {
        buscarEventosPorCorreo();
})
function anadeSuscripcionEventosListeners(){
        // Selecciona los elementos i.suscripcionEventos
        let botonesAccionesALosRegistros = document.querySelectorAll("i.suscripcionEventos");

        // Añade un listener a cada botón
        botonesAccionesALosRegistros.forEach(function(button) {
                
                button.addEventListener('click', function() {
                        let eventId = this.getAttribute("eventoId");
                        anadirUsuarioAlEvento(eventId);
                });
        });
}

//LISTENERS TUS EVENTOS
function anadeTusEventosListeners(){
        // Selecciona los elementos i.MisEventos
        let botonesAccionesALosRegistros = document.querySelectorAll('i.MisEventos');

        // Añade un listener a cada botón
        botonesAccionesALosRegistros.forEach(function(button) {
                button.addEventListener('click', function() {
                        
                        let eventId = this.getAttribute("eventoId");
                        
                        if (this.classList.contains('edit')) {
                                obtenerUnEvento(eventId);
                        } else if (this.classList.contains('delete')) {
                                borrarRegistro(eventId);
                        }       
                        });
        });
}

DOM.$addDate.addEventListener("click", () => {
        addDateToList()
});

DOM.$enviarTuEvento.addEventListener("click", () => {
        altaEvento();
});

DOM.$modificarTuEvento.addEventListener("click", () => {
        guardarCambios();
});

//===============FUNCIONES====================
function saludo(username){
    DOM.$saludo.innerHTML+=username.toUpperCase();
}

function getUsername(){
    
    const ruta= rutaGetUsername;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
    xhr.send();

    xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                    usuarioObj = JSON.parse(this.responseText);
                    let username= usuarioObj.username;
                    saludo(username);
            }
    }
}

function buscarEventosPorCorreo(){
    
    const ruta= rutaBuscarEventosPorCorreo  + DOM.$emailBuscarEventos.value;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
    xhr.send();

    xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                    listaEventosPorCorreo= JSON.parse(this.responseText);
                    mostrarRegistrosEventosParaSuscribirse(listaEventosPorCorreo);
                    anadeSuscripcionEventosListeners();
            }
    }
}

function mostrarRegistrosEventosParaSuscribirse(eventos){
    let contenidoTabla = "";
    for (const evento of eventos) {
            let contenidoFila =
            `<tr>
            <td>${evento.description}</td>
            <td>${evento.date}</td>
            <td>${evento.place}</td>
            <td>${evento.price}</td>
            `
            contenidoFila += `
                <td>
                        <i eventoId="${evento.id}" class="material-symbols-outlined suscripcionEventos add">Add</i> 
                </td>
                 `
            contenidoTabla += contenidoFila;
    }
    DOM.$tbodyBusqueda.innerHTML = contenidoTabla;
 
}

//FUNCIONES TUS EVENTOS
function addDateToList() {
        DOM.$fechas.innerHTML += DOM.$calendar.value + "<br>";
        fecha.push(DOM.$calendar.value);
}


function obtenerEventosDelUsuarioDesdeElServidor(){
    const ruta= rutaObterEventosUsuarioDelServidor;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
    xhr.send();

    xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                    var registros = JSON.parse(this.responseText);
                    arrayEventosDelUsuario = registros;//TODO
                    mostrarRegistrosTusEventos(registros);
                    anadeTusEventosListeners();
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
               <i eventoId="${evento.id}" class="material-symbols-outlined MisEventos edit">Edit</i> 
               <i eventoId="${evento.id}" class="material-symbols-outlined MisEventos delete">Delete</i>
            </td>
                `
            contenidoTabla += contenidoFila;
    }
    DOM.$tbodyTusEventos.innerHTML = contenidoTabla;
}


function altaEvento() {

    const ruta= rutaAltaEvento;
    const json = {
            description: DOM.$description.value,
            date: fecha,
            place: DOM.$place.value,
            price: DOM.$price.value,
           // companions: arrayViajerosDTO, //TODO
            creator: usuarioObj
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", ruta)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken)

    xhr.send(JSON.stringify(json))

    xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                    let evento = JSON.parse(this.responseText);
                    let idRegistro = evento.id;
                    anadirUsuarioAlEvento(idRegistro);
            }
    }
}

function anadirUsuarioAlEvento(idRegistro) {

    const ruta = rutaAnadirUsuarioAlEvento + idRegistro

    let xhr = new XMLHttpRequest();
    xhr.open("POST", ruta);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    xhr.send();

    xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                    var evento = JSON.parse(this.responseText);
                    //Obtiene la nueva lista de Eventos
                    //y la muestra por pantalla
                    obtenerEventosDelUsuarioDesdeElServidor();
                    borrarCampos();
            }
    }
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
                    let registro = JSON.parse(this.responseText);
                    mostrarRegistroEnFormulario(registro)
                    cambiarBotones();
                    activarCheckTablaArrayPersonas(idEvento);//TODO
            }
    }
    //idRegistro = idEvento;
    DOM.$tituloOpcionEvento.innerHTML = "Modificar";
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
    fecha = [];
    DOM.$fechas.innerHTML = "";
    DOM.$asistentes.innerHTML = "";
    DOM.$checkboxesBDPersonas

}

function guardarCambios() {

    const ruta = rutaModificarUnEvento

    const json = {
            id: idRegistro,
            description: DOM.$description.value,
            date: fecha,
            place: DOM.$place.value,
            price: DOM.$price.value,
            companions: arrayViajerosDTO //TODO
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
                    obtenerEventosDelUsuarioDesdeElServidor;
                    cambiarBotones();
                    borrarCampos();
                    DOM.$tituloOpcionEvento.innerHTML = "Añadir";
            }
    }
}


function borrarRegistro(id) {

        const ruta = rutaBorrarEvento + id;

        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        obtenerEventosDelUsuarioDesdeElServidor;
                }
        }
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