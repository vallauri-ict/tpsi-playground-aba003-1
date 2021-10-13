"use strict";

$(document).ready(function () {
  let _lstNazioni = $("#lstNazioni");
  let _tabStudenti = $("#tabStudenti");
  let _divDettagli = $("#divDettagli");
  let selectedNation;
  _divDettagli.hide();

  let request = inviaRichiesta("get", "/api/nazioni");
  request.fail(errore);
  request.done(function (data) {
    request.done((data) => {
      console.log(data);

      for (const nation of data.nazioni) {
        $("<a>", {
          class: "dropdown-item",
          href: "#",
          text: nation,
          click: visualizzaPersona,
        }).appendTo(_lstNazioni);
      }
    });
  });
  function visualizzaPersona() {
    //bottone dell listbox
    if ($(this).text()) {
      selectedNation = $(this).text();
    }
    let nation = $(this).text();
    //i parametri li mandiamo ad invia richiesta sempre in json
    let request = inviaRichiesta("get", "/api/persone", {
      nazione: selectedNation,
    });
    request.fail(errore);
    request.done(function (data) {
      _tabStudenti.empty();
      _divDettagli.hide();
      for (const person of data) {
        let tr = $("<tr>").appendTo(_tabStudenti);
        for (const key in person) {
          $("<td>").appendTo(tr).text(person[key]);
        }

        let td = $("<td>").appendTo(tr);
        let button = $("<button>");
        button.appendTo(td);
        button.text("Dettagli");
        button.click(dettagli);
        button.prop("name", person.name);

        td = $("<td>").appendTo(tr);
        button = $("<button>");
        button.appendTo(td);
        button.text("Elimina");
        button.click(elimina);
        button.addClass("Eliminazione");
        button.prop("name", person.name);
      }
    });
  }

  function dettagli() {
    let name = $(this).prop("name");
    let request = inviaRichiesta("PATCH", "/api/dettagli", {
      person: $(this).prop("name"),
    });
    request.fail(errore);
    request.done(function (data) {
      console.log(data);
      _divDettagli.show(1000);
      _divDettagli
        .children(".card-img-top")
        .prop("src", data[0].picture.thumbnail);
      _divDettagli.find(".card-title").text(name);
      _divDettagli.find(".card-title").text(name);
      let s = `<b>Gender: </b>${data[0].gender}<br>`;
      s += `<b>Address: </b>${JSON.stringify(data[0].location)}<br>`;
      s += `<b>Address: </b>${data[0].email}<br>`;
      s += `<b>Address: </b>${JSON.stringify(data[0].dob)}<br>`;
      _divDettagli.find(".card-text").text(s);
    });
  }
  function elimina() {
    let request = inviaRichiesta("DELETE", "/api/elimina", {
      person: $(this).prop("name"),
    });
    request.fail(errore);
    request.done(function (message) {
      alert(message);
      visualizzaPersona();
    });
  }
});
