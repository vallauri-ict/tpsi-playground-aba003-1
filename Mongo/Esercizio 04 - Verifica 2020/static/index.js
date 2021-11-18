"use strict";

$(() => {
  $("button").click(() => {
    let dateStart = $("#dateStart").val();
    let dateEnd = $("#dateEnd").val();
    
    let request = inviaRichiesta("POST","/api/servizio01",{"dateStart":dateStart,"dateEnd":dateEnd})
        request.catch(errore);
        request.then(data=>{
            console.log(data);
        })
});
});
