alert(document.cookie); // muestra todas las cookies
console.log("get session "+ sessionStorage.getItem("user"));

/************** Variables ******************/
$mensaje = document.getElementById("mensaje");
$registros = document.getElementById("registros");
$borrar = document.getElementById("borrar");

window.addEventListener('load', function () {
    downloadData();
});

/*$borrar.addEventListener("click", (e)=>{
    const field=e.field;
    const value= field.value;
    console.log("Value = "+ value);
    borrarRegistro(e);
})*/


function downloadData() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:8080/person/all', true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.response.length == 0) {
                $mensaje.innerHTML = "No hay datos";
            } else {
                //$mensaje.innerHTML=  xhr.response.length + JSON.stringify(xhr.response);
                mostrarTabla(xhr.response);
            }
        }

    }
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
