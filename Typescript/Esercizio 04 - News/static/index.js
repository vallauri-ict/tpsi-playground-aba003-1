"use strict";

$(document).ready(function () {
  let wrapper = $("#wrapper");
  let request = inviaRichiesta("get", "/api/notizie");
  request.fail(errore);
  request.done(function (notizie) {
    /*console.log(notizie[1]);*/
    console.log(notizie.notizie);

    for (const notizia of notizie.notizie) {
      let div = $("<div></div>").appendTo(wrapper);
      let span = $("<span></span>").appendTo(div);
      span.text(notizia.titolo);
      let a = $("<a>");
      a.prop("href", "#");
      a.text("leggi");
      a.appendTo(div);
      a.prop("notizia", notizia.file);
      a.click(dettagli);

      span = $("<span></span>").appendTo(div);
      span.addClass("nVis");
      span.text(`Visualizzato ${notizia.visualizzazioni} volte`);
      span.prop("views",notizia.visualizzazioni)
      $("<br>").appendTo(div);
    }
  });

  function dettagli() {
    let request = inviaRichiesta("post", "/api/dettagli", {notizia: $(this).prop("notizia"),});
    let _this=$(this);
    request.fail(errore);
    request.done(function (data) {
      console.log( _this.text())
      $("#news").empty();
      $("#news").html(data.file);
      let views=_this.next().prop("views")+1;
      _this.next().text(`Visualizzato ${views} volte`);
      _this.next().prop("views",views)
    });
  }
});
