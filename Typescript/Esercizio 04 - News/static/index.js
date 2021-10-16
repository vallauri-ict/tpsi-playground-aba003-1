"use strict";
 let current;
$(document).ready(function () {
  let wrapper = $("#wrapper");
  let request = inviaRichiesta("get", "/api/notizie");
  request.fail(errore);
  request.done(function (news) {
    console.log(news)
    
    for (const notizia of news) {
      let div = $("<div></div>").appendTo(wrapper);
      let span = $("<span></span>").appendTo(div);
      span.text(notizia.titolo);
      let a = $("<a>");
      a.prop("href", "#");
      a.text("leggi");
      a.appendTo(div);
      a.prop("notizia", notizia.file);
      a.click(dettagli);
      a.prop("views",notizia.visualizzazioni)

      span = $("<span></span>").appendTo(div);
      span.addClass("nVis");
      span.text(`Visualizzato ${notizia.visualizzazioni} volte`);
      $("<br>").appendTo(div);
    }
  });

  function dettagli() {
    let request = inviaRichiesta("post", "/api/dettagli", {notizia: $(this).prop("notizia")});
    let _this=$(this);
    request.fail(errore);
    request.done(function (data) {
      console.log(data)
      current=data.file;
     
        $("#news").empty();
       
        let request = inviaRichiesta("get", "/api/views", {notizia: _this.prop("notizia")});
        request.fail(errore);
        request.done(function(pisnelo){
          _this.next().text(`Visualizzato ${pisnelo.ris} volte`)
        })
        $("#news").html(data.file);
      
     
    });
  }
});
