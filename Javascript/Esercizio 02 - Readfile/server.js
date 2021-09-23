"use strict";

const _http = require("http");
const _url = require("url");
const _fs = require("fs");
let HEADERS = require("./headers.json");
const _mime = require("mime");

const PORT = 1337;
let paginaErrore;
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
  .listen(PORT, function (err) {
    if (!err) {
      console.log("Connessione stabilita con successo sulla porta " + PORT);
      paginaErrore = _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
          paginaErrore = data;
        } else {
          paginaErrore = "<h1>Errore Pagina 404</h1>";
        }
      });
    }else{
      console.log("Ooops something went wrong on PORT: " + PORT);
    }
    
  });

