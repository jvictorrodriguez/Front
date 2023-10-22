

let $calendar=document.getElementById("calendar");
let $fechas=document.getElementById("fechas");
let $button= document.getElementById("button");
let $addDate= document.getElementById("addDate");
let contador=0;

let dates={};
let fecha=[];


/*for (let i=0;i<5;i++){
    fecha.push(new Date('2023-10-31'))    
}*/





let trySendDates = async()=>{

    
    const user= {
        
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventDto)        
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

