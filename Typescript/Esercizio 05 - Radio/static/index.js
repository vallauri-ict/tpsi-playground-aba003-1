"use strict"
$(document).ready(function () {
   let request = inviaRichiesta("get", "/api/states")
   request.fail(errore);
   request.done(function (data) {
       console.log(data)
   })
})