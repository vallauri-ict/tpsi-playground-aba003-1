"use strict";

$(document).ready(function () {
  let list = $("#list");
  let divfacts = $("#facts");
  let btninvia = $("#btnInvia");
  let textarea = $("#newFact");
  let btnAdd = $("#btnAdd");
  let request = inviaRichiesta("GET", "/api/elenco");
  request.fail(errore);
  request.done(function (data) {
    for (const iterator of data) {
      let opt = $("<option>").appendTo(list);
      opt.text(iterator);
    }
    list.change();
  });

  list.change(function () {
    divfacts.empty();
    let request1 = inviaRichiesta("GET", "/api/facts", {
      category: $(this).val(),
    });
    request1.fail(errore);
    request1.done(function (data) {
      for (const iterator of data) {
        let _input = $("<input>")
          .val(iterator.id)
          .prop("type", "checkbox")
          .appendTo(divfacts);
        let _span = $("<span></span>").text(iterator.value).appendTo(divfacts);
        $("<br>").appendTo(divfacts);
      }
    });
  });
  btninvia.click(function () {
    let idsArr = [];
    $("input:checked").each(function () {
      idsArr.push($(this).val());
    });

    let request1 = inviaRichiesta("POST", "/api/rate", { ids: idsArr });
    request1.fail(errore);
    request1.done(function (data) {
      alert(data.ris);
    });
  });

  btnAdd.click(function () {
    let category =[];
    category.push(list.val());
    let value1 = textarea.val();
    let data = new Date().toLocaleString();
    console.log(data);

    let request1 = inviaRichiesta("POST", "/api/add", {
      categories: category,
      created_at: data,
      updated_at: data,
      score: 0,
      value:value1
    });
    request1.fail(errore);
    request1.done(function (data) {
      alert("Dato inserito con successo")
      list.change();
    });
  });
});
