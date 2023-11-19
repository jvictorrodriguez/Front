//============== V A R I A B L E S  ========================
// Exporta las variables inicializadas
//export const { jwtoken, host } = initializeVariables();
export const jwtoken = readCookie("token");
export const host = "http://localhost:9090";
import * as DOM from "./domElement.js";
import { arrayPersonas} from "./person.js"; //variables


/*


// Función para inicializar las variables antes de exportarlas
function initializeVariables() {
        const jwtoken = readCookie("token");
        const host = "http://localhost:9090";
        return { jwtoken, host };
}
      


*/

let arrayParticipantes;        //Contiene un array de los participantes del eventoDTO no el de la BD del usuario.

let usuarioObj;  //Hace referencia al objeto del usuario logueado       
let fecha = [];         //Array de fechas- Recoge las fechas que se añaden al crear/modificar un evento
let idRegistro;                 //Variable que contiene el campo id del registro y que se utiliza para Alta/Recuperar/Guardar un evento
let listaEventosPorCorreo;      //Recoge un array de todos los eventos del usuario localizados por su correo electrónico
let arrayEventosDelUsuario;     //Recoge un array de todos los eventos del PROPIO USUARIO




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
}

//=========== LISTENERS BUSCAR EVENTOS ====================
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

//=========== LISTENERS TUS EVENTOS ====================
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

//==================================================
//=========== F U N C I O N E S ====================
//==================================================

//=================== SALUDO ===================
function saludo(username){
    DOM.$saludo.innerHTML+=username.toUpperCase();
}

//=================== GET USERNAME ===================
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
//==================================================
//===========  B U S Q U E D A  ====================
//==================================================

//=================== BUSCAR EVENTOS  =======================
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

//=================== MOSTRAR EVENTOS PARA SUSCRIBRIRSE ===================
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

//==================================================
//===========  FUNCIONES TUS EVENTOS  ====================
//==================================================

//=================== AÑADE FECHAS A LA LISTA ===================
function addDateToList() {
        DOM.$fechas.innerHTML += DOM.$calendar.value + "<br>";
        fecha.push(DOM.$calendar.value);
}

//=================== OBTENER TODOS LOS EVENTOS ===================
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

//=================== MOSTRAR TABLA ===================
function mostrarRegistrosTusEventos(registros) {

    let contenidoTabla = "";
    for (const evento of registros) {
            let paginaDetalle= "demo_form.php?name1=value1&name2=value2";
            let contenidoFila = `<tr>
            <td><a href="eventoDetalle.html?id=${evento.id}">
            
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

//=================== ALTA DE UN EVENTO ===================
function altaEvento() {

    const ruta= rutaAltaEvento;
    const json = {
            description: DOM.$description.value,
            date: fecha,
            place: DOM.$place.value,
            price: DOM.$price.value,
            companions: arrayParticipantes, 
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
                    idRegistro = evento.id;
                    anadirUsuarioAlEvento(idRegistro);
            }
    }
}

//=================== AÑADIR UN USUARIO A UN EVENTO ===================
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

//=================== OBTENER UN EVENTO ===================
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
                  //  activarCheckTablaArrayPersonas(registro);//TODO
            }
    }
    idRegistro = idEvento;
    DOM.$tituloOpcionEvento.innerHTML = "Modificar";
}

//=================== GUARDAR CAMBIOS  ===================
function guardarCambios() {

        const ruta = rutaModificarUnEvento
    
        const json = {
                id: idRegistro,
                description: DOM.$description.value,
                date: fecha,
                place: DOM.$place.value,
                price: DOM.$price.value,
                companions: arrayParticipantes 
        };
    
    
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send(JSON.stringify(json));
    
        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        let registro = JSON.parse(this.responseText);
                        obtenerEventosDelUsuarioDesdeElServidor();
                        cambiarBotones();
                        borrarCampos();
                        DOM.$tituloOpcionEvento.innerHTML = "Añadir";
                }
        }
    }
    
    //=================== BORRAR UN EVENTO ===================
    function borrarRegistro(id) {
    
            const ruta = rutaBorrarEvento + id;
    
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", ruta, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
            xhr.send();
    
            xhr.onload = function() {
                if (xhr.status === 200) {
                  console.log('Registro eliminado con éxito');
                  obtenerEventosDelUsuarioDesdeElServidor();
                } else {
                  console.log('Error al eliminar el registro');
                }
               };
    }
    
//============================================================
//=================== F O R M U L A R I O  ===================
//============================================================

//=================== FORMULARIO - MOSTRAR REGISTROS DE EVENTOS ===================
function mostrarRegistroEnFormulario(evento) {
    //Recibimos el objeto evento. Se trata de un único evento
    //Mostramos en el formulario los campos del evento
    DOM.$description.value = evento.description;
    DOM.$calendar.value = evento.date;
    DOM.$place.value = evento.place;
    DOM.$price.value = evento.price;
    DOM.$asistentes.innerHTML = "";
    




    //Creamos un array para guardar los ids de los participantes
    let idsParticipantes=[];
    //Inicializamos el arrayParticipantes que contendrá los objetos Personas participantes
    arrayParticipantes=[];
    
    //Añadimos los ids de los participantes a ese array.
    //Añadimos los objetos personas al arrayParticipantes.

    for (const person of evento.companions) {
        idsParticipantes.push(evento.companions.id);
        arrayParticipantes.push(person);
        //Mostramos en el formulario los nombres de los participantes
        DOM.$asistentes.innerHTML+= person.name + "<br>";
    }


    
   
}

//=================== CAMBIAR BOTONES ===================
function cambiarBotones() {

    DOM.$borrarTuEvento.classList.toggle("hidden");
    DOM.$modificarTuEvento.classList.toggle("hidden");
    DOM.$enviarTuEvento.classList.toggle("hidden");
    if(DOM.$modificarTuEvento.classList.contains("hidden")){
        borrarCampos();
    }
}

//=================== BORRAR CAMPOS ===================
function borrarCampos() {
    DOM.$description.value = "";
    DOM.$calendar.value = "";
    DOM.$place.value = "";
    DOM.$price.value = "";
    fecha = [];
    DOM.$fechas.innerHTML = "";
    DOM.$asistentes.innerHTML = "";
    DOM.$checkboxesBDPersonas

        DOM.$asistentes.innerHTML="";
        arrayParticipantes=[];
        for (const checkbox of $checkBoxBDPersonas) {
                checkbox.checked=false;
        }
        
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