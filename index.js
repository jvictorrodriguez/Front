
let boton=document.getElementById("btnSubmit");

boton.addEventListener("click", evento=>{
            registrarPelicula();
});


let registrarPelicula = async()=>{

    let fields = {};

    fields.title=document.getElementById("title").value;
    fields.director=document.getElementById("director").value;
    fields.genre=document.getElementById("genre").value;

    const peticion= await fetch("http://localhost:9090/api/peliculas",
    {
        method:"POST",  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)        
    });
}
