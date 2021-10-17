
import { prototype } from 'events';
import *  as _http from 'http';
import { json } from 'stream/consumers';
import { HEADERS } from "./headers";
import { Dispatcher } from './dispatcher';
import * as radios from './radios.json';
import states from "./states.json";
import * as _fs from 'fs';
import * as _mime from 'mime';

let dispatcher = new Dispatcher();
let PORT = 1338;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
    //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
    dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);


//********************registrazione dei servizi*****************************


dispatcher.addListener("GET", "/api/states",function(req,res){
    let vetState = [];
  for (const state of states) {
    vetState.push(state.name + "-" + state.stationcount);
  }
  vetState.sort();
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify(vetState));
  res.end();
})
