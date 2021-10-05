import { prototype } from 'events';
import *  as _http from 'http';
let HEADERS = require("./headers.json");

//importa solo quello che abbiamo esportato l' istanza della classe in forma anonima
let dispatcher = require("./dispatcher.ts"); //possiamo linkarla con il require perchè è installato @type/node che mette a disposizione il require
let PORT =1337;
let server = _http.createServer(function (req,res) { //funzione richiamata ogni volta 
    //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
    dispatcher.dispatch(req,res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: "+PORT );

//registrazione dei listener riceve un lisener come parametro e lo va a registrare dentro il vettore
dispatcher.addListener("POST","/api/servizio1",function (req:any,res:any) {
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify({"ris":"ok"}));
    res.end();
})
dispatcher.addListener("GET","/api/servizio2",function (req:any,res:any) {
    res.writeHead(200,HEADERS.json);
    let nome =req["GET"].nome;
    res.write(JSON.stringify({"ris":nome}));
    res.end();
})


//questo file è il main