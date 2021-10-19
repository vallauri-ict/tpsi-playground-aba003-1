"use strict";


$(document).ready(function () {
  let lstRegioni = $("#lstRegioni");
  let tbody=$("#tbody");
   let request = inviaRichiesta("get","/api/elenco");
   request.fail(errore);
   request.done(function(data){
      for (const regione of data) {
        let opt = $("<option></option>").appendTo(lstRegioni);
        opt.text(`${regione.name}[${regione.stationcount} emittenti]`);
        opt.val(regione.name);
      }
      lstRegioni.val('tutti').change();
   })
   

   lstRegioni.on("change",function () {
        tbody.empty();
        let request1=inviaRichiesta("get","/api/radios",{regione:$(this).val()});
        request1.fail(errore);
        
        request1.done(function (radios) {
          for (const radio of radios) {
              let tr = $("<tr></tr>").appendTo(tbody);
              let td = $("<td>").appendTo(tr);
              let img = $("<img>").appendTo(td);
              img.prop("src",radio.favicon);
              img.css({width:"40px",height:"40px"})

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
              img.prop("src",'./like.jpg');
              img.css({width:"40px",height:"40px"})
              img.prop("idRadio",radio.id)
              
              img.click(function () {
                let _this=$(this);
                  let request2=inviaRichiesta("POST","/api/like",{idRadio:_this.prop("idRadio")})
                 
                  request2.fail(errore);
                  request2.done(function (data) {
                    alert(`Hai messo like alla radio ${radio.name}`)
                    console.log(data.ris);
                    _this.parent().prev().text(data.ris);
                  })
              })


              



          }
        })
   })
});
