/*************** V A R I A B L E S ********************/
//let host = "http://localhost:9090";
//let jwtoken = "";
//let idRegistro;



/********VARIABLES  PERSONAS ************* */
//let $tbodyPersonas=document.getElementById("tbodyPersonas"); DECLARADO EN EVENTOS.JS
let tituloOpcionPersonas= document.getElementById("tituloOpcionPersonas");
let arrayPersonas;      //Contiene la BD de personas del usuario activo
let arrayViajerosDTO=[];
let $checkboxesBDPersonas;

/* FORMULARIO */
let $tituloOpcion = document.getElementById("tituloOpcion");

let $name = document.getElementById("name");                        //DTO
let $dob = document.getElementById("dob");                          //DTO

let $enviarPersona = document.getElementById("enviarPersona");      //botón
let $modificarPersona = document.getElementById("modificarPersona");//botón






/****************LISTENERS******************/

window.addEventListener('load', function () {
  //obtener();    TODO
  obtenerLista();
});

$enviarPersona.addEventListener("click", () => {
  altaPersona();
})

$modificarPersona.addEventListener("click",()=>{
  guardarCambiosPersona(idRegistro);
})



/******************** OBTENER INFORMACIÓN DE REGISTROS DEL SERVIDOR********************** */

let obtenerLista = async () => {

  jwtoken = readCookie("token");

  const peticion = await fetch(host + "/person/allByUser",
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + jwtoken
      }
    });

  const personas = await peticion.json();
  arrayPersonas=personas;
  mostrarRegistrosPersonas(personas);
  
}

/******************* MOSTRAR TABLA ***************** */
function mostrarRegistrosPersonas(personas) {
  let contenidoTabla = "";

  for(var i=0; i < arrayPersonas.length; i++) {
    let contenidoFila = 
    `<tr>
      <td>${arrayPersonas[i].id}</td>
      <td>${arrayPersonas[i].name}</td>
      <td>${arrayPersonas[i].dob}</td>
      <td>${arrayPersonas[i].age}</td>
      <td>
        <i onClick="obtenerUnRegistroPersona(${arrayPersonas[i].id})" class="material-symbols-outlined">Edit</i> 
        <i onClick="borrarRegistroPersona(${arrayPersonas[i].id})" class="material-symbols-outlined">Delete</i>
      </td>
      <td>
          <input type="checkbox" id="${arrayPersonas[i].id}" name="listaPersonasBD" value="${i}"
          onClick="incluirPersonaAEvento()">
      </td>
    </tr>
`;
    contenidoTabla += contenidoFila;
  }
$tbodyPersonas.innerHTML = contenidoTabla;

}

/*********** GET DEL REGISTRO *** OBTENER UN ÚNICO  REGISTRO*****************/
let obtenerUnRegistroPersona = async (id)=> {
  idRegistro=id;

  const peticion = await fetch(host+"/person/"+id,
 
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + jwtoken
      }
    });

  const persona = await peticion.json();

    $name.value= persona.name;
    $dob.value= persona.dob;

//Cambiar botones
$modificarPersona.classList.toggle("hidden");
$enviarPersona.classList.toggle("hidden");

}

/************** BORRAR REGISTRO *******************/ 
let borrarRegistroPersona = async (id) => {

  const peticion = await fetch(host + "/person/"+id,
    {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + jwtoken
      }
    });
obtenerLista();
}

/********************** EDITAR REGISTRO ******************/
function guardarCambiosPersona(id) {

  let ruta = host + "/person/"+id;

  const json = {
      name: $name.value,
      dob: $dob.value
  };

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", ruta, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + jwtoken);
  xhr.send(JSON.stringify(json))

  xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
                  let registro = JSON.parse(this.responseText);
                  obtenerLista();
                  cambiarBotonesPersona();
                  borrarCamposPersona();
          }
  }
}

function cambiarBotonesPersona(){
  $modificarPersona.classList.toggle("hidden");
  $enviarPersona.classList.toggle("hidden");
}
function borrarCamposPersona(){
  $name.value="";
  $dob.value="";
}


/******************** ALTA REGISTRO *************** */
function  altaPersona() {

      let ruta= host + "/person/create";     

      const json = {
        name: $name.value,
        dob: $dob.value,
      };
      
      
      let xhr = new XMLHttpRequest();
      xhr.open("POST", ruta)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken)
      xhr.send(JSON.stringify(json))

      xhr.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                      var evento = JSON.parse(this.responseText);
                      obtenerLista();
                      borrarCamposPersona();
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
