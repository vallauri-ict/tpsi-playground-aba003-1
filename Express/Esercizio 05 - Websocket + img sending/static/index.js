"use strict";
$(document).ready(function () {
  let user = { username: "", room: "" };
  let serverSocket;
  let btnConnetti = $("#btnConnetti");
  let btnDisconnetti = $("#btnDisconnetti");
  let btnInvia = $("#btnInvia");
  let btn_file = $("#file");

  btnInvia.prop("disabled", true);
  btnDisconnetti.prop("disabled", true);

  // mi connetto al server che mi ha inviato la pagina,
  // il quale mi restituisce il suo serverSocket
  // io.connect é SINCRONO, bloccante
  $("#btnConnetti").on("click", function () {
    serverSocket = io({ transports: ["websocket"], upgrade: false }).connect();

    serverSocket.on("connect", function () {
      console.log("connessione ok");
      impostaUser();
      serverSocket.emit("login", JSON.stringify(user));
    });

    serverSocket.on("loginAck", function (data) {
      if (data == "NOK") {
        alert("Nome già esistente. Scegliere un altro nome");
        impostaUser();
        serverSocket.emit("login", JSON.stringify(user));
      } else document.title = user.username;
    });

    // ricezione di un messaggio dal server
    serverSocket.on("message_notify", function (data) {
      data = JSON.parse(data);
      visualizza(data);
    });

    serverSocket.on("disconnect", function () {
      alert("Sei stato disconnesso!");
    });

    btnInvia.prop("disabled", false);
    btnConnetti.prop("disabled", true);
    btnDisconnetti.prop("disabled", false);
  });

  // 2a) invio messaggio
  $("#btnInvia").click(function () {
    let file = "";
    let msg = "";

    if (btn_file.prop("files")[0] != null) {
      file = btn_file.prop("files")[0];
      let req = resizeAndConvert(file)
        .then((img) => {
          console.log(img);
          serverSocket.emit("message", JSON.stringify({ "msg": msg, "img": img }) );
         
        })
        .catch(() => {
          alert("error");
        });
    } else {
      if ($("#txtMessage").val() != null) {
        msg = $("#txtMessage").val();
        serverSocket.emit("message", JSON.stringify({ "msg": msg, "img": file }));
      }
    }
    $("#txtMessage").val("");
    $("#file").val('');
  });

  // 3) disconnessione
  $("#btnDisconnetti").click(function () {
    serverSocket.disconnect();
    btnInvia.prop("disabled", true);
    btnConnetti.prop("disabled", false);
    btnDisconnetti.prop("disabled", true);
  });

  function impostaUser() {
    user.username = prompt("Inserisci lo username:");
    if (user.username == "pippo" || user.username == "pluto") {
      user.room = "room1";
    } else {
      user.room = "defaultRoom";
    }
  }

  function visualizza(data) {
    //data.image_sent
    let wrapper = $("#wrapper");
    let container = $("<div class='message-container'></div>");
    container.appendTo(wrapper);

    //img
    let img = $("<img>");
    img.appendTo(container);
    data.img.startsWith("https") || data.img.startsWith("data:image")
      ? img.prop({ src: data.img, width: 50, style: "inline" })
      : img.prop({ src: "img/" + data.img, width: 50, style: "inline" });

    // username e date
    let date = new Date(data.date);
    let mittente = $(
      "<small class='message-from'>" +
        data.from +
        " @" +
        date.toLocaleTimeString() +
        "</small>"
    );
    mittente.appendTo(container);

    // messaggio
    let message = $("<p class='message-data'>" + data.message + "</p>");
    message.appendTo(container);
 if (data.image_sent!="") {
  img = $("<img>");
  img.appendTo(container);
  img.prop({ src: data.image_sent, width: 50, style: "inline" });
 }
   

    // auto-scroll dei messaggi
    /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
           l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
		*/
    let h = wrapper.prop("scrollHeight");
    // fa scorrere il testo verso l'alto in 500ms
    wrapper.animate({ scrollTop: h }, 500);
  }
  /* *********************** resizeAndConvert() ****************************** */
  /* resize (tramite utilizzo della libreria PICA.JS) and base64 conversion    */
  function resizeAndConvert(file) {
    /* step 1: lettura tramite FileReader del file binario scelto dall'utente.
             File reader restituisce un file base64
  // step 2: conversione del file base64 in oggetto Image da passare alla lib pica
  // step 3: resize mediante la libreria pica che restituisce un canvas
              che trasformiamo in blob (dato binario di grandi dimensioni)
  // step 4: conversione del blob in base64 da inviare al server               */
    return new Promise(function (resolve, reject) {
      const WIDTH = 640;
      const HEIGHT = 480;
      let type = file.type;
      let reader = new FileReader();
      reader.readAsDataURL(file); // restituisce il file in base 64
      //reader.addEventListener("load", function () {
      reader.onload = function () {
        let img = new Image();
        img.src = reader.result; // reader.result restituisce l'immagine in base64
        img.onload = function () {
          if (img.width < WIDTH && img.height < HEIGHT) resolve(reader.result);
          else {
            let canvas = document.createElement("canvas");
            if (img.width > img.height) {
              canvas.width = WIDTH;
              canvas.height = img.height * (WIDTH / img.width);
            } else {
              canvas.height = HEIGHT;
              canvas.width = img.width * (HEIGHT / img.height);
            }
            let _pica = new pica();
            _pica
              .resize(img, canvas, {
                unsharpAmount: 80,
                unsharpRadius: 0.6,
                unsharpThreshold: 2,
              })
              .then(function (resizedImage) {
                // resizedImage è restituita in forma di canvas
                _pica
                  .toBlob(resizedImage, type, 0.9)
                  .then(function (blob) {
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function () {
                      resolve(reader.result); //base 64
                    };
                  })
                  .catch((err) => reject(err));
              })
              .catch(function (err) {
                reject(err);
              });
          }
        };
      };
    });
  }
});
