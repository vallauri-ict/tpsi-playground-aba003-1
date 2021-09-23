"use strict";

import * as _http from  "http";
import * as _url from  "url";
import * as _fs from  "fs";
import * as _mime from  "mime";
import { strict } from "assert/strict";

let HEADERS = require("./headers.json");


const PORT :number = 1337;
let paginaErrore:string;
_http
  .createServer(function (req, res) {
    let metodo = req.method;
    let url = _url.parse(req.url, true);

    let risorsa = url.pathname;
    let parametri = url.query;
    console.log(`method: ${metodo}  -  risorsa: ${risorsa} + parametri: ${JSON.stringify(parametri)}`)

    if (risorsa == "/") {
      
     risorsa='/index.html'
    } 
    if (!risorsa.startsWith("/api/")) {
      risorsa = "./static" + risorsa;
      _fs.readFile(risorsa, function (err, data) {
        if (!err) {
          let header = { "Content-Type": _mime.getType(risorsa) };
          res.writeHead(200, header);
          res.write(data);
        } else {
          res.writeHead(404, HEADERS.html);
          res.write(paginaErrore);
        }
        res.end();
      });
    }else if (risorsa=='/api/servizio1') {
        //gestione del servizio
        let json={"ris":"ok"};
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify(json));
        res.end();
    }else{
        res.writeHead(404);
        res.write("Servizio inesistente");
        res.end();
    }
  })
  .listen(PORT, function () {
    
      console.log("Connessione stabilita con successo sulla porta " + PORT);
      _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
          paginaErrore = data.toString();
        } else {
          paginaErrore = "<h1>Errore Pagina 404</h1>";
        }
      });
    
    
  });

