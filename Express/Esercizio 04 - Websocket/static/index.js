$(document).ready(function () {
    
  let btnConnetti = $("#btnConnetti");
  let btnDisconnetti = $("#btnDisconnetti");
  let serverSocket;

  btnConnetti.prop("disabled", false);
  btnDisconnetti.prop("disabled", true);

  let user = { username: "", room: "default" };
 

  btnConnetti.click(function () {
   

    btnConnetti.prop("disabled", true);
    btnDisconnetti.prop("disabled", false);

    serverSocket = io({
      transports: ["websocket"],
      upgrade: false,
    }).connect();

      serverSocket.on("connect", function () {
      console.log("connessione ok");

      trytolog();
      
    });

    // 1b) utente valido / non valido
    serverSocket.on("loginAck", function (data) {
      if (data == "NOK") {
       trytolog();
      } else document.title = user.username;
    });

    serverSocket.on("message_notify", function (data) {
      // ricezione di un messaggio dal server
      data = JSON.parse(data);
      visualizza(data.from, data.message, data.date);
    });

    serverSocket.on("disconnect", function () {
      alert("Sei stato disconnesso!");
    });
  });

  // 2a) invio messaggio
  $("#btnInvia").click(function () {
    let msg = $("#txtMessage").val();
    serverSocket.emit("message", msg);
  });

  // 2b) ricezione della risposta

  // 3) disconnessione
  btnDisconnetti.click(function () {
    btnConnetti.prop("disabled", false);
    btnDisconnetti.prop("disabled", true);
    serverSocket.disconnect();
  });

  function visualizza(username, message, date) {
    let wrapper = $("#wrapper");
    let container = $("<div class='message-container'></div>");
    container.appendTo(wrapper);

    // username e date
    date = new Date(date);
    let mittente = $(
      "<small class='message-from'>" +
        username +
        " @" +
        date.toLocaleTimeString() +
        "</small>"
    );
    mittente.appendTo(container);

    // messaggio
    message = $("<p class='message-data'>" + message + "</p>");
    message.appendTo(container);

    // auto-scroll dei messaggi
    /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
           l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
		*/
    let h = wrapper.prop("scrollHeight");
    // fa scorrere il testo verso l'alto in 500ms
    wrapper.animate({ scrollTop: h }, 500);
  }

  function trytolog(){
    user.username = prompt("Inserisci lo username:");
  
    if ( user.username == 'pippo'||user.username =='pluto') {
      user.room="priviledged"
    } 
    
    serverSocket.emit("login", JSON.stringify(user));
  }
});


