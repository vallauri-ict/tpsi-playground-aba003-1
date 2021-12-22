"use strict";



$(document).ready(function () {
  let divIntestazione = $("#divIntestazione");
  let divCollections = $("#divCollections");
  let table = $("#mainTable").children("tbody");
  let divDettagli = $("#divDettagli");
  let currentCollection = "";

  let request = inviaRichiesta("get", "api/getCollections");
  request.fail(errore);
  request.done(function (collections) {
    console.log(collections);
    let label = divCollections.children();
    for (const collection of collections) {
      let clone = label.clone();
      clone.appendTo(divCollections);
      clone.find("input").val(collection.name);
      clone.find("span").text(collection.name);
      divCollections.append("<br>");
    }
    label.remove();
  });

  divCollections.on("click", "input[type=radio]", function () {
    //input non esiste ancora e viene creato nella call back
    currentCollection = $(this).val();
    let request = inviaRichiesta("GET", "/api/" + currentCollection);
    request.fail(errore);
    request.done(function (data) {
      table.empty();
      divIntestazione.find("strong").eq(0).text(currentCollection);
      divIntestazione.find("strong").eq(1).text(data.length);
      if (currentCollection != "unicorns") {
        $("#filters").slideUp();
      } else {
        $("#filters").slideDown();
      }

      for (const iterator of data) {
        let tr = $("<tr>");
        tr.appendTo(table);

        let td = $("<td>");
        td.text(iterator._id); //attenzone alla cisha
        td.appendTo(tr);
        td.css("text-align", "center");
        td.prop("id", iterator._id);
        td.prop("method","get" );
        td.click(visualizzaDettagli);

        td = $("<td>");
        td.text(iterator.name);
        td.appendTo(tr);
        td.css("text-align", "center");
        td.prop("id", iterator._id);
        td.prop("method","get" );
        td.click(visualizzaDettagli);

        td = $("<td>");
        td.appendTo(tr);
        td.css("text-align", "center");

        $("<div>").appendTo(td).prop("id",iterator._id).prop("method","patch").click(visualizzaDettagli);;
        $("<div>").appendTo(td);
        $("<div>").appendTo(td).prop("id",iterator._id).click(elimina);

      }
    });
  });

  function elimina() {
      let request = inviaRichiesta("DELETE","/api/"+currentCollection+"/"+$(this).prop("id"));
      request.fail(errore);
      request.done(function () {
          alert("Documento cancellato correttamente");
          divDettagli.children("textarea").val({})
          aggiorna();
      })
  }

  function visualizzaDettagli() {
      let method =$(this).prop("method").toUpperCase();
      let id =$(this).prop("id");
    let request = inviaRichiesta(
      "GET",
      "/api/" + currentCollection + "/" + id
    );
    request.fail(errore);
    request.done(function (data) {
        if (method=="GET") {
            let content = "";
            for (const key in data) {
                content += "<strong>" + key + "</strong> :" + data + "<br>";
            }
            divDettagli.html(content);
        }else{
            divDettagli.empty();
            let txtArea = $("<textarea>");
            delete data._id
            txtArea.val(JSON.stringify(data,null,2)); //controllo si usa val
            
         
            txtArea.appendTo(divDettagli);
            autosize(txtArea);
            
            visualizzaPulsanteInvia(method,id)
        }
    });
  }

  $("#btnAdd").click(function () {
    divDettagli.empty();
    let txtArea = $("<textarea>");
    txtArea.val("{}"); //controllo si usa val
    txtArea.appendTo(divDettagli);
    visualizzaPulsanteInvia("POST");
    
  });

  function aggiorna() {
    var event = jQuery.Event("click");
    event.target = divCollections.find("input[type=radio]:checked")[0]; //per prenderci il puntatore javascript (primo elemento della collezione jquery)
    divCollections.trigger(event); //questo si aspetta un puntatore a javascript
  }

  function visualizzaPulsanteInvia(method,id="") {//se l id non gli arriva mette stringa vuota
    let btnInvia = $("<button></button>");
    btnInvia.text("Invia");
    btnInvia.appendTo(divDettagli);
    btnInvia.click(function () {
      let param = "";
      try {
        //vedere sltatnro che quelo che l' utente ha scritto sia sintatticamente corretto
        param = JSON.parse(divDettagli.children("textarea").val());
      } catch (error) {
        alert("json non valido");
        return;
      }
      let request = inviaRichiesta(method, "/api/" + currentCollection+"/"+id, param);
      request.fail(errore);
      request.done(function () {
        alert("Operazione eseguita correttamente");
        divDettagli.empty();
        //TRIGGER EVENTO DLEGATO
        aggiorna();
      });
    });
      
  }

});
