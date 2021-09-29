$(document).ready(function() {

    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("post", "/api/servizio1", {"nome":"pippo"}); //non vedo parametri perchè vengono passati nel body
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
});
