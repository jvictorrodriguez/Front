/*************** V A R I A B L E S ********************/
let $mensaje = document.getElementById("mensaje");
let $registros = document.getElementById("registros");


let $name;
let $dob;

let $enviar = document.getElementById("enviar");

$enviar.addEventListener("click", () => {
    altaPersona();
})
let host="";

window.addEventListener('load', function () {
    listarPersonas();
    console.log("Insde window");
});






    let listarPersonas = async () => {
        console.log("Insde listarpersonas");

        jwtoken = readCookie("token");

        const peticion = await fetch("http://localhost:9090/person/allByUser",
                {
                        method: "GET",
                        headers: {
                                "Accept": "application/json",
                                "Authorization": "Bearer " + jwtoken
                        }
                });

        const personas = await peticion.json();

        let contenidoTabla = "";

        for (let persona of personas) {
                let contenidoFila = `<tr>
                <td>${persona.id}</td>
                <td>${persona.name}</td>
                <td>${persona.dob}</td>
                <td>${persona.age}</td>
            </tr>
            `;
                contenidoTabla += contenidoFila;
        }

        document.querySelector("#tabla tbody").outerHTML = contenidoTabla;
}

function mostrarTabla(people) {
    let tabla = "";
    for (const persona of people) {
        let fila = `<tr>
    <td>${persona.id}</td>
    <td>${persona.name}</td>
    <td>${persona.dob}</td>
    <td>${persona.age}</td>
    <td>

    <i onClick="borrarRegistro(${persona.id})" class="material-icons button delete">borrar</i>
    <i onClick="editarPelicula(${persona.id})" class="material-icons button delete">editar</i>

    </td>
    </tr>`;
        tabla += fila;
    }
    $registros.outerHTML = tabla;
}

function borrarRegistro(id){
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", 'http://localhost:8080/person/id', true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    //xhr.responseType = 'json';
    xhr.send();
}

function editarPersona(id){

}

function altaPersona() {
 $name= document.getElementById("name");
 $dob= document.getElementById("dob");

    const apiUrl = 'http://localhost:9090/person/create';
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
        $mensaje.textContent = JSON.stringify(data.message, null, 2);
      })
      .catch(error => {
       // console.error ('Error:', error);
       $mensaje.textContent = JSON.stringify(data.message, null, 2);
       console.log("error");
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
