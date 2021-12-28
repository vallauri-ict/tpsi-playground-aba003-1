"use strict"

$(()=>{

    $("#btnInvia").click(()=>{
        let request= inviaRichiesta("GET","/api/servizio1",{"nome":"Unico"});
        request.fail(errore);
        request.done(data=>alert(JSON.stringify(data)));
    })

    $("#btnInvia2").click(()=>{
        let request = inviaRichiesta("PATCH", "/api/servizio2",{"nome":"Unico","vampires":5});
        request.fail(errore);
        request.done(data=>{
                if (data.modifiedCount>0) {
                    alert("Aggiornamento eseguito correttamente");
                }
                else
                {
                    alert("Nessuna corrispondenza trovata");
                }
        })
    })


    $("#btnInvia3").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio3/m/brown");
        request.fail(errore);
        request.done(data=>alert(JSON.stringify(data)))
    });
})

   

