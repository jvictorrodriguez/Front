/*************** V A R I A B L E S ********************/
let jwtoken = readCookie("token");
let host = "http://localhost:9090"
let $saludo = document.getElementById("saludo");

let username;
let usuarioObj;
let idRegistro;
let dates = {};
let fecha = [];
let idUsuario;

let arrayEventos; // json con todos los eventos suscritos por el usuarios logueado
//let companions;


/********VARIABLES  BUSCAR EVENTOS************* */
let $emailBuscarEventos = document.getElementById("emailBuscarEventos");
let $botonBuscarEventos = document.getElementById("botonBuscarEventos");
let $tbodyBusqueda = document.getElementById("tbodyBusqueda");

/********VARIABLES  PERSONAS ************* */
let $tbodyPersonas = document.getElementById("tbodyPersonas");

/********VARIABLES  TUS  EVENTOS************* */
let $tbodyTusEventos = document.getElementById("tbodyTusEventos");

/* FORMULARIO */
let $tituloOpcionEvento = document.getElementById("tituloOpcionEvento");
let $description = document.getElementById("description");
let $calendar = document.getElementById("calendar");
let $fechas = document.getElementById("fechas");                //p
let $addDate = document.getElementById("addDate");              //button//listener
let $date = document.getElementById("date");
let $place = document.getElementById("place");
let $price = document.getElementById("price");
let $asistentes = document.getElementById("asistentes");

let $borrarTuEvento = document.getElementById("borrarTuEvento");
let $enviarTuEvento = document.getElementById("enviarTuEvento");                //botón//listener
let $modificarTuEvento = document.getElementById("modificarTuEvento");          //botón//listener

/****************LISTENERS******************/

window.onload = function () {
        getUsername();
        obtenerRegistrosTusEventosDelServidor();
        obtenerPersonasUsuario();
}

//LISTENERS BUSCAR EVENTOS
$botonBuscarEventos.addEventListener("click", () => {
        buscarEventosPorCorreo();
})

//LISTENERS TUS EVENTOS
$addDate.addEventListener("click", () => {
        addDateToList()
});

$enviarTuEvento.addEventListener("click", () => {
        altaEvento();
});

$modificarTuEvento.addEventListener("click", () => {
        guardarCambios();
});


/****************FUNCIONES******************/

function getUsername() {
        let ruta = host + "/user";

        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        usuarioObj = JSON.parse(this.responseText);
                        username = usuarioObj.username;
                        $saludo.innerHTML += username;
                }
        }
}

//BUSCAR EVENTOS
function buscarEventosPorCorreo() {

        let ruta = host + "/event/search?email=" + $emailBuscarEventos.value;

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
                                        <i onClick=" addUserToEvent(${evento.id})" class="material-symbols-outlined">Add</i> 
                                        
                                </td>
                                `
                                contenidoTabla += contenidoFila;
                        }
                        $tbodyBusqueda.innerHTML = contenidoTabla;
                }
        }
}


//FUNCIONES TUS EVENTOS
function addDateToList() {
        $fechas.innerHTML += $calendar.value + "<br>";
        fecha.push($calendar.value);
}

function obtenerRegistrosTusEventosDelServidor() {

        let ruta = host + "/event/allByUser"

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
                let contenidoFila = `<tr>
                <td>${evento.description}</td>
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
        $tbodyTusEventos.innerHTML = contenidoTabla;
}

function altaEvento() {

        let ruta = host + "/event";

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

        let ruta = host + "/event/addUserToEvent/" + idRegistro

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
        $tituloOpcionEvento.innerHTML = "Modificar";

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
        //Recibimos el objeto evento. Se trata de un único evento
        //Mostramos en el formulario los campos del evento
        $description.value = evento.description;
        $calendar.value = evento.date;
        $place.value = evento.place;
        $price.value = evento.price;
        $asistentes.innerHTML = "";
        let checkAsistentes = "";
        for (const person of evento.companions) {
                checkAsistentes += `
                <input type="checkbox" name="companions" id="${person.name}" value="${person.id}" checked>
                <label for=${person.name}>${person.name}</label>`
        }
        $asistentes.innerHTML = checkAsistentes;
        activarCheckTablaArrayPersonas(evento);

}






function cambiarBotones() {
        $borrarTuEvento.classList.toggle("hidden");
        $modificarTuEvento.classList.toggle("hidden");
        $enviarTuEvento.classList.toggle("hidden");
}

function borrarCampos() {
        $description.value = "";
        $calendar.value = "";
        $place.value = "";
        $price.value = "";
        fecha = [];
        $fechas.innerHTML = "";
        $asistentes.innerHTML = "";
        $checkboxesBDPersonas

}


function guardarCambios() {

        let ruta = host + "/event/update";

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

/** Mostrar personas */

function obtenerPersonasUsuario() {
/*
        let ruta = host + "/person/allByUserddddddddddddddddddddddddddd";


        let xhr = new XMLHttpRequest();
        xhr.open("GET", ruta, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
        xhr.send();

        xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                        var personas = JSON.parse(this.responseText);


                        let contenidoTabla = "";

                        for (const persona of personas) {

                                let contenidoFila = `<tr>
                                <td>${persona.id}</td>
                                <td></td>
                                <td>${persona.name}</td>
                                <td>${persona.dob}</td>
                                <td>${persona.age}</td>
                            
                        `
                                contenidoFila += `<td>
                                <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
                                        
                                </td>
                                `
                                contenidoTabla += contenidoFila;
                        }
                        $tbodyPersonas.innerHTML = contenidoTabla;
                }
        }
        */
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

        $checkboxesBDPersonas = document.getElementsByName('listaPersonasBD');
        $asistentes.innerHTML = "";
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
                        $asistentes.innerHTML = checkAsistentes;
                        
                }
        }

