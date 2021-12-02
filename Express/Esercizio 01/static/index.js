"use strict";

$(document).ready(function() {
  $("#get").on("click", function() {
      let request = inviaRichiesta("api", "/api/risorsa1", {"nome":"pippo"});
      request.fail(errore);
      request.done(function(data) {
          alert(JSON.stringify(data));
      });
  });

  $("#post").on("click", function() {
      let request = inviaRichiesta("post", "/api/risorsa1", {"nome":"pluto"});
      request.fail(errore);
      request.done(function(data) {
          alert(JSON.stringify(data));
      });
  });
});
