import { prototype } from 'events';
import *  as _http from 'http';
import { json } from 'stream/consumers';
import { HEADERS } from "./headers";
import { Dispatcher } from './dispatcher';
import * as notizie from './notizie';
import * as _fs from 'fs';
import * as _mime from 'mime';

let dispatcher = new Dispatcher();
let PORT = 1337;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
    //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
    dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);


//********************registrazione dei servizi*****************************


dispatcher.addListener("GET", "/api/notizie", function (req, res) {

    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify(notizie))
    res.end();

})

dispatcher.addListener("POST", "/api/dettagli", function (req, res) {

    let notizia = "./news/" + req["BODY"].notizia
    _fs.readFile(notizia, function (err, data) {
        if (!err) { 
            
            res.writeHead(200, HEADERS.json);
            res.write(JSON.stringify({"file":`${data}`}));
            res.end();
        } else {
            res.writeHead(404, HEADERS.text);
            res.write("<h1>File non trovato</h1>");
            res.end();
        }
    })


})
