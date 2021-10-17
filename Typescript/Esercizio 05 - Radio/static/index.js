"use strict";

$(document).ready(function () {
  let lstRegioni = $("#lstRegioni");

  let request = inviaRichiesta("get", "/api/update");
  request.fail(errore);
  request.done(function (data) {
    console.log(data);
  });

  let request2 = inviaRichiesta("get", "/api/elenco");
  request2.fail(errore);
  request2.done(function (data) {
    console.log(data);
    for (const state of data) {
      let option = $("<option>").appendTo(lstRegioni);
      option.text(state.name + `[${state.stationcount} emittenti] `);
    }
    lstRegioni.val('tutti').change();
  });

  lstRegioni.on("change", function () {
    
    let tbody = $("#tbody");
    tbody.empty();
    let regione = lstRegioni.val().split("[")[0];
    
    let request3 = inviaRichiesta("GET", "/api/radios", { state: regione });
    request3.fail(errore);
    request3.done(function (radios) {
      for (const radio of radios) {
        let tr = $("<tr>").appendTo(tbody);
        let td = $("<td>").appendTo(tr);
        let img = $("<img>").appendTo(td);
        img.prop("src", radio.favicon);
        img.css({ width: "40px", height: "40px" });

        td = $("<td>").appendTo(tr);
        td.text(radio.name);

        td = $("<td>").appendTo(tr);
        td.text(radio.codec);

        
        td = $("<td>").appendTo(tr);
        td.text(radio.bitrate);

        
        td = $("<td>").appendTo(tr);
        td.text(radio.votes);

         td = $("<td>").appendTo(tr);
         img = $("<img>").appendTo(td);
        img.prop("src", "./like.jpg");
        img.css({ width: "40px", height: "40px" });
        img.prop("radio",radio.name)
        img.click(function () {
            
            let request4=  inviaRichiesta("POST", "/api/like", { radio: $(this).prop("radio") });
            let _this = $(this);
            request4.fail(errore);
            request4.done(function (data) {
                console.log(data);
                _this.parent().prev().text(data)
            })
        })

        

      }
    });
  });
});
