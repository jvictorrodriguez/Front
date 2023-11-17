// Importa los elementos del DOM 
import * as DOM from "./domElement.js";
import {jwtoken} from "./eventos.js"; //variables


/*************** V A R I A B L E S ********************/
const host = "http://localhost:9090"
let arrayParticipantes=[];
export let arrayPersonas;      //Contiene la BD de personas del usuario activo
let idPersona;
let tituloOpcionPersonas= document.getElementById("tituloOpcionPersonas");


//=========== Rutas EndPoints Server====================
const rutaObtenerPersonasBD = host + "/person/allByUser";
const rutaObtenerUnRegistroPersona = host+ "/person/"   //+id,
const rutaGuardarCambiosPersona= host + "/person/"      //+id;
const rutaAltaUnaPersona=  host + "/person/create";  
const rutaBorrarUnaPersona = host + "/person/"      //+id, 


//==================================================
//=========== L I S T E N E R S ====================
//==================================================
window.addEventListener('load', function () {
  obtenerPersonas();    
});

DOM.$modificarPersona.addEventListener("click",()=>{
  guardarCambiosPersona(idPersona);
  //incluirPersonaAEvento(idPersona);
})


DOM.$enviarPersona.addEventListener("click", () => {
  altaPersona();
})



//=========== LISTENERS PERSONAS ====================
function anadePersonasListeners(){
  // Selecciona los elementos de la tabla Personas
   const $botonesAccionesSobreBDPersonas = document.querySelectorAll('i.MisPersonas');
   const $checkPersonas = document.querySelectorAll("input.MisPersonas");
  // Añade un listener a cada botón
  $botonesAccionesSobreBDPersonas.forEach(function(button) {
          button.addEventListener("click", function() {
                  
                  let personaId = this.getAttribute("personaId");
                  
                  if (this.classList.contains("edit")) {
                          obtenerRegistroUnaPersona(personaId);
                  } else if (this.classList.contains("delete")) {
                          borrarPersona(personaId);
                  }       
                  });
  });
$checkPersonas.forEach(function(checkbox) {
          checkbox.addEventListener("change", function() {
              anadirParticipantesAEvento();
})

});
}

//==================================================
//=========== F U N C I O N E S ====================
//==================================================

//=================== OBTENER TODAS LAS PERSONAS ===================
function obtenerPersonas(){
    
  const ruta= rutaObtenerPersonasBD;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", ruta, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
  xhr.send();

  xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
                  arrayPersonas= JSON.parse(this.responseText);
                  mostrarRegistrosPersonas(arrayPersonas);
                  anadePersonasListeners();
          }
  }
}


//=================== OBTENER UNA PERSONA ===================

function obtenerRegistroUnaPersona(idPersona){

  const ruta= rutaObtenerUnRegistroPersona + idPersona;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", ruta, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
  xhr.send();

  xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            let persona= JSON.parse(this.responseText);
            mostrarPersonaEnFormulario(persona);                  
            cambiarBotonesPersona();
          }
  }
}

//=================== ALTA DE UNA PERSONA ===================
function  altaPersona() {

  const ruta=  rutaAltaUnaPersona;

  const json = {
    name: DOM.$name.value,
    dob: DOM.$dob.value,
  };
  
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", ruta)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken)
  xhr.send(JSON.stringify(json))

  xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
                  let persona = JSON.parse(this.responseText);
                  obtenerPersonas();   
                  mostrarRegistrosPersonas();
                  borrarCamposPersona();
          }
  }
}

//=================== GUARDAR MODIFICACIÓN DE UNA PERSONA ===================
function guardarCambiosPersona(idPersona){

  const ruta = rutaGuardarCambiosPersona + idPersona;

        const json = {
          name: DOM.$name.value,
          dob: DOM.$dob.value
      };

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", ruta, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
  xhr.send(JSON.stringify(json));

  xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
                  let persona= JSON.parse(this.responseText);
                  obtenerPersonas();
                  cambiarBotonesPersona();
                  borrarCamposPersona();
          }
  }

}
//=================== BORRAR REGISTRO ===================
function borrarPersona(idPersona){

  const ruta = rutaBorrarUnaPersona + idPersona;
    
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", ruta, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
  xhr.send();

  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Registro eliminado con éxito');
      obtenerPersonas();
    } else {
      console.log('Error al eliminar el registro');
    }
   };
}
//=================== MOSTRAR TABLA ===================
function mostrarRegistrosPersonas(personas) {

  let contenidoTabla = "";

  for(var i=0; i < personas.length; i++) {
    let contenidoFila = 
    `<tr>
      <td>
          <input personaId="${personas[i].id}" type="checkbox" id="${personas[i].id}" class="MisPersonas" name="${personas[i].name}" value="${i}">
      </td>
      <td>${personas[i].name}</td>
      <td>${personas[i].dob}</td>
      <td>${personas[i].age}</td>
      <td>
        <i personaId="${personas[i].id}" class="material-symbols-outlined MisPersonas edit">Edit</i> 
        <i personaId="${personas[i].id}" class="material-symbols-outlined MisPersonas delete">Delete</i>  
      </td>
      
      </tr>`;
    contenidoTabla += contenidoFila;
  }
DOM.$tbodyPersonas.innerHTML = contenidoTabla;
}
//=======================================================
//=================== F O R M U L A R I O  ==============
//=======================================================
function mostrarPersonaEnFormulario(persona) {
  //Recibimos el objeto persona. Se trata de un único evento
  //Mostramos en el formulario los campos de persona
  idPersona= persona.id;
  DOM.$name.value= persona.name;
  DOM.$dob.value= persona.dob;
}
//=================== CAMBIAR BOTONES PERSONA ===================
function cambiarBotonesPersona(){
  DOM.$modificarPersona.classList.toggle("hidden");
  DOM.$enviarPersona.classList.toggle("hidden");
}
//=================== BORRAR CAMPOS PERSONA ===================

function borrarCamposPersona(){
  DOM.$name.value="";
  DOM.$dob.value="";
}

//=================== AÑADIR PARTICIPANTES A UN  EVENTO ===================
function anadirParticipantesAEvento(){
  DOM.$asistentes.innerHTML="";
  arrayParticipantes=[];
  for (let i=0; i< $checkPersonas.length; i++){
    if($checkPersonas[i].checked){
      DOM.$asistentes.innerHTML+= $checkPersonas[i].name + "<br>";
      arrayParticipantes.push(arrayPersonas[i]);
    }
  }
}