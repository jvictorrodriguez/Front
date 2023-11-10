/*************** V A R I A B L E S ********************/
let host = "http://localhost:9090";
let jwtoken = "";
let idRegistro;

let $tabla = document.getElementById("tabla");
let $enviar = document.getElementById("enviar");
let $tituloOpcion = document.getElementById("tituloOpcion");
let $modificar = document.getElementById("modificar");


/*************** variables del DTO a enviar ***************/
let $name = document.getElementById("name");
let $dob = document.getElementById("dob");





/****************LISTENERS******************/

window.addEventListener('load', function () {
  //obtener();    TODO
  obtenerLista();
});

$enviar.addEventListener("click", () => {
  altaPersona();
})

$modificar.addEventListener("click",()=>{
  guardarCambios(idRegistro);
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
  mostrarRegistros(personas);
  
}

/******************* MOSTRAR TABLA ***************** */
function mostrarRegistros(personas) {
  let contenidoTabla = "";

  for (let persona of personas) {
    let contenidoFila = `<tr>
                  <td>${persona.id}</td>
                  <td>${persona.name}</td>
                  <td>${persona.dob}</td>
                  <td>${persona.age}</td>
                  <td>
  
                  <i onClick="obtenerRegistro(${persona.id})" class="material-symbols-outlined">Edit</i>
                  <i onClick="borrarRegistro(${persona.id})"class="material-symbols-outlined">Delete</i>
                  </td>
              </tr>
              `;
    contenidoTabla += contenidoFila;
  }
  document.querySelector("#tabla tbody").outerHTML = contenidoTabla;
}

/*********** GET DEL REGISTRO *** OBTENER UN ÚNICO  REGISTRO*****************/
let obtenerRegistro = async (id)=> {
  jwtoken = readCookie("token");
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
$modificar.classList.toggle("hidden");
$enviar.classList.toggle("hidden");

}

/************** BORRAR REGISTRO *******************/ 
let borrarRegistro = async (id) => {

  jwtoken = readCookie("token");

  const peticion = await fetch(host + "/person/"+id,
    {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + jwtoken
      }
    });
//obtenerLista();
}

/********************** EDITAR REGISTRO ******************/
let guardarCambios = async (id) => {

jwtoken = readCookie("token");
 let registro={};
    registro.name= $name.value;
    registro.dob = $dob.value;
 


  const peticion = await fetch(host + "/person/"+id,
    {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + jwtoken
      },
      body: JSON.stringify(registro)
    });
//Cambiar botones
$modificar.classList.toggle("hidden");
$enviar.classList.toggle("hidden");
//borrar campos
$name.value="";
$dob.value="";

obtenerLista();
  
}

/******************** ALTA REGISTRO *************** */
function altaPersona() {
  $name = document.getElementById("name");
  $dob = document.getElementById("dob");

  const apiUrl = host + '/person/create';
  const data = {
    name: $name.value,
    dob: $dob.value,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + jwtoken
    },
    body: JSON.stringify(data),
  };

  fetch(apiUrl, requestOptions)
    .then(response => {
      /*if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      */
      return response.json();
    })
    .then(data => {
      personas = JSON.stringify(data.message, null, 2);
    })
    .catch(error => {
      // console.error ('Error:', error);
      //$mensaje.textContent = JSON.stringify(data.message, null, 2);
      //console.log("error");
    });

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
