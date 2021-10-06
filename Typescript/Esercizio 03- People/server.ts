import { prototype } from 'events';
import *  as _http from 'http';
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
import * as persons from './persons.json';

let PORT =1337;
let server = _http.createServer(function (req,res) { //funzione richiamata ogni volta 
    //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
    dispatcher.dispatch(req,res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: "+PORT );


//********************registrazione dei servizi*****************************
dispatcher.addListener("GET","/api/nazioni",function (req:any,res:any) {   
    res.writeHead(200,HEADERS.json);
   let nazioni=[];
   for (const person of persons["results"]) { //
       if (!nazioni.includes(person.location.country)) {
           nazioni.push(person.location.country);
       }
   }
   nazioni.sort();
   res.write(JSON.stringify({"nazioni":nazioni}));
    res.end();
})



//questo file è il main