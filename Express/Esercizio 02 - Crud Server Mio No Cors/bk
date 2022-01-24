"use strict";

$(() => {
  let divCollections = $("#divCollections");
  let divDettagli = $("#divDettagli");
  let divFilters = $("#filters");
  let spanCollection = $("#divIntestazione").find("strong").eq(0);
  let spanDocuments = $("#divIntestazione").find("strong").eq(1);
  let tbody = $("body").find("tbody");
  let btnAdd = $("#btnAdd");
  let currentCollection;

  divFilters.hide();

  let request = inviaRichiesta("GET", "/api/getCollections");
  request.fail(errore);
  request.done((data) => {
    data.forEach((element) => {
      let label = $("<label></label>").appendTo(divCollections);
      let radio = $('<input type="radio" name="optCollection" />').appendTo(
        label
      );
      radio.val(element.name);
      radio.click(requestCollection);
      let span = $("<span></span>").text(element.name).appendTo(label);
    });
  });

  function requestCollection() {
    currentCollection = $(this).val();
    createTable(currentCollection);
  }

  function createTable(currentCollection) {
    tbody.empty();
    divDettagli.empty();
    spanCollection.text(currentCollection);
    if (currentCollection != "unicorns") {
      divFilters.slideUp();
    } else {
      divFilters.slideDown();
    }
    let request = inviaRichiesta("GET", "/api/" + currentCollection);
    request.fail(errore);
    request.done(createBody);
  }

  function createBody(data) {
    tbody.empty()
    spanDocuments.text(data.length);
    data.forEach((item) => {
      let tr = $("<tr>").appendTo(tbody);
      let td = $("<td></td>")
        .prop("element", item)
        .prop("method", "GET")
        .click(visualizzaDettagli)
        .appendTo(tr);
      td.text(item._id);

      td = $("<td></td>")
        .prop("element", item)
        .prop("method", "GET")
        .click(visualizzaDettagli)
        .appendTo(tr);
      td.text(item.name);

      td = $("<td></td>").appendTo(tr);

      $("<div>")
        .appendTo(td)
        .prop("element", item)
        .prop("method", "PATCH")
        .click(visualizzaDettagli);
      $("<div>")
        .appendTo(td)
        .prop("element", item)
        .prop("method", "PUT")
        .click(visualizzaDettagli);
      $("<div>").appendTo(td).prop("id", item._id).click(elimina);

    });
  }

  function visualizzaDettagli() {
    let element = $(this).prop("element");
  
    if ($(this).prop("method") == "GET") {
      let content = ""; 
      for (const key in element) {
        content += `<strong>${key}</strong> : ${element[key]} <br>`;
        divDettagli.html(content);
      }
    }else{

      let id = $(this).prop("element")._id;
      delete($(this).prop("element")._id);
      divDettagli.empty();
      let label = $("<label></label>");
      label.text("Modify the " + currentCollection.slice(0, -1));
      label.appendTo(divDettagli);
      $("<br>").appendTo(divDettagli);
      let textArea = $("<textarea></textarea>");
      textArea.appendTo(divDettagli);
      textArea.val(JSON.stringify(element, null, 2));
      textArea.css("height",textArea.get(0).scrollHeight);
      $("<br>").appendTo(divDettagli);
      createButtonInsert($(this).prop("method"),id);
    }
  }

  btnAdd.click(() => {
    divDettagli.empty();
    let label = $("<label></label>");
    label.text("Add a new " + currentCollection.slice(0, -1));
    label.appendTo(divDettagli);
    $("<br>").appendTo(divDettagli);
    let textArea = $("<textarea></textarea>");
    textArea.appendTo(divDettagli);
    textArea.val('{"name":"insert here the value"}');
    $("<br>").appendTo(divDettagli);
    createButtonInsert("POST");
  });

  function elimina() {
    let idToEliminate = $(this).prop("id");
    let request = inviaRichiesta(
      "DELETE",
      "/api/" + currentCollection + "/" + idToEliminate
    );
    request.fail(errore);
    request.done(() => {
      alert("Element deleted correctly");
      createTable(currentCollection);
    });
  }

  function createButtonInsert(method,id="") {
    let btnInsert = $("<button>");
    btnInsert.text("Insert");
    btnInsert.appendTo(divDettagli);
    btnInsert.click(() => {
      try {
        let request = inviaRichiesta(method, "/api/" + currentCollection+"/"+id, {
          json: JSON.parse(divDettagli.children("textarea").val()),
        });
        request.fail(errore);
        request.done(() => {
          alert("Elaboration done on the current " + currentCollection.slice(0, -1));
          createTable(currentCollection);
        });
     } catch (e) {
        alert("You inserted a non valid json :(");
        return false;
      }
    });
  }

  $("#btnFind").on("click", function(){
		let filterJson = {}
		let hair = $("#lstHair").children("option:selected").val()
		if (hair)
      filterJson["hair"]=hair.toLowerCase();
		
		let male = divFilters.find("input[type=checkbox]").first()
				.is(":checked")
		let female = divFilters.find("input[type=checkbox]").last()
				.is(":checked")
		if(male && !female)
      filterJson["gender"]='m';
		else if(female && !male)
      filterJson["gender"]='f';
		
		let request = inviaRichiesta("get", "/api/" + currentCollection, filterJson)
		request.fail(errore)
		request.done(createBody)

	})
});
