window.onload = function(){
    listarPeliculas;
    alert("loading tabla.js");
}
let listarPeliculas = async()=>{

    const peticio = await fetch("http://localhost:8080/api/peliculas",
    {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    const peliculas = await peticio.json();

    let contenidoTabla ="";

    for (let pelicula of peliculas) {
        let contenidoFila= `<tr>
        <td>${pelicula.id}</td>
        <td>${pelicula.title}</td>
        <td>${pelicula.director}</td>
        <td>${pelicula.genre}</td>
        </tr>
        `
        contenidoTabla += contenidoFila;
    }
    console.log("Hemos llegado hasta aquí");
    document.querySelector("#tabla tbody").outerHTML = contenidoTabla;
   
}
//document.querySelector("#tabla tbody").outerHTML="<h1>Prueba</h1>"
//<i class="material-icons button edit"></i>
//<i class="material-icons button delete"></i>