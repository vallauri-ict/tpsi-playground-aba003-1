import { prototype } from 'events';
import *  as _http from 'http';
import { json } from 'stream/consumers';
import { HEADERS } from "./headers";
import { Dispatcher } from './dispatcher';
import * as notizie from './notizie.json';
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
    let arr = [];
    for (const key in notizie) {
        arr.push(notizie[key]);
    }
    arr.pop();
    res.write(JSON.stringify(arr))
    res.end();

})
dispatcher.addListener("GET", "/api/views", function (req, res) {

    let text = req["GET"].notizia
    let value;
    res.writeHead(200, HEADERS.json);
    let arr = [];
    for (const key in notizie) {
        arr.push(notizie[key]);
    }
    arr.pop();

    for (const iterator of arr) {
        if (iterator.file == text) {
                value=iterator.visualizzazioni;
        }}
    res.write(JSON.stringify({"ris":value}))
    res.end();

})

dispatcher.addListener("POST", "/api/dettagli", function (req, res) {

    let notizia = "./news/" + req["BODY"].notizia
    let text = req["BODY"].notizia

    let arr = [];
    for (const key in notizie) {
        arr.push(notizie[key]);
    }
    arr.pop();
    for (const iterator of arr) {
        if (iterator.file == text) {
            iterator.visualizzazioni++;
          
            update();
            _fs.readFile(notizia, function (err, data) {
                if (!err) {

                    res.writeHead(200, HEADERS.json);
                    res.write(JSON.stringify({ "file": `${data}` }));
                    res.end();
                } else {
                    res.writeHead(404, HEADERS.text);
                    res.write("<h1>File non trovato</h1>");
                    res.end();
                }
            })
        }
    }

    function update(){
            _fs.writeFile("./notizie.json",JSON.stringify(arr),function(err){
                    
                if(err)
                {
                    res.writeHead(404,HEADERS.text);
                    res.write(err);
                }
                else
                {
                    res.writeHead(200,HEADERS.json);
                    res.write("Json salvato correttamente su disco");
                }
                res.end();
            })
    }
})
