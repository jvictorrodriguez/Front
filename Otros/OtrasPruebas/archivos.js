let $button =  document.getElementById("button");
let $file= document.getElementById("inputFile");




let sendFile = async()=>{

    
    const file= {
        
        update: Date.now
    }

    const eventDto= {
        description: 'Description',
        place: 'Place',
        date: fecha,
        username: 'user',
        password: 'password'
    }

    console.log("Dentro de tyrSendDates");
    //console.log(JSON.stringify(user));
    console.log(JSON.stringify(eventDto));





const peticion= await fetch("http://localhost:9090/events/create",
        {   
            method:"POST",  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'image/png'
            },
            body:     JSON.stringify(eventDto)   
        });



}

function addDateToList(){    



    $fechas.innerHTML+=calendar.value +"<br>";
    fecha.push(calendar.value);
}

$button.addEventListener("click", ()=>{
    trySendDates()}
    
);

$addDate.addEventListener("click",()=>{
    addDateToList()
});
