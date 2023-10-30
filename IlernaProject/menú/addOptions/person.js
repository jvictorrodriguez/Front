/************** Variables ******************/
$mensaje= document.getElementById("mensaje");

window.addEventListener('load', function() {
    console.log('La página ha terminado de cargarse!!');
    downloadData();
});


function downloadData(){




    let xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:8080/person/all',true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = function () {
        if (xhr.status == 200) {
            $mensaje.innerHTML=  JSON.stringify(xhr.response);
        }
}
}
