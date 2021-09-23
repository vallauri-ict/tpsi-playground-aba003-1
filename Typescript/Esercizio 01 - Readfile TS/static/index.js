$(document).ready(function() {

    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio1", {"nome":"pippo"}); //passo come primo parametro il tipo di richiesta per /risorsa1 e gli passo un parametro json
        request.fail(errore); //fail procedura di errore
        request.done(function(data) { //done alert dati
            alert(JSON.stringify(data));
        });
    });

    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio2", {"nome":"pippo"}); //passo come primo parametro il tipo di richiesta per /risorsa1 e gli passo un parametro json
        request.fail(errore); //fail procedura di errore
        request.done(function(data) { //done alert dati
            alert(JSON.stringify(data));
        });
    });
});
