import { prototype } from 'events';
import *  as _http from 'http';
import { json } from 'stream/consumers';
import {HEADERS} from "./headers";
import { Dispatcher } from './dispatcher';
import * as persons from './persons.json';

let dispatcher = new Dispatcher();
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
dispatcher.addListener("GET","/api/persone",function (req:any,res:any) {   
    res.writeHead(200,HEADERS.json);
    let nazione = req["GET"].nazione; // i parametri sono passati e messi in questo campo nel dispatcher
    let json =[];
  for (const person of persons["results"]) {
      if (person.location.country==nazione) {
       let jsonPerson ={
           "name":person.name.title +" " + person.name.first +" "+ person.name.last,
           "city":person.location.city,
           "state":person.location.state,
           "cell":person.cell
       }
       json.push(jsonPerson);
    }
   
  }
   res.write(JSON.stringify(json));
    res.end();
})

dispatcher.addListener("PATCH","/api/dettagli",function (req,res) {
   
    let persona=[];
    let personReq =req.BODY.person;
    
    for (const person of persons.results) {
        if (person.name.title +" " + person.name.first +" "+ person.name.last===personReq) {
           persona.push(person);
            break;
        }
    }
    if (persona.length>0) {
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify(persona));
         res.end();
    }else{
        res.writeHead(404,HEADERS.text);
        res.write("Persona non trovata");
         res.end();
    }     

})
dispatcher.addListener("DELETE","/api/elimina",function (req:any,res:any) {   
    let trovata=false;
    let personReq =req.BODY.person;
    let i;
    for (i =0;i < persons.results.length; i++) {
        if (persons.results[i].name.title +" " + persons.results[i].name.first +" "+ persons.results[i].name.last===personReq) {
           trovata=true;
             break;
         }
        
    }
    if (trovata) {
        persons.results.splice(i,1);
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify("Record cancellato correttamente"));
         res.end();
    }else{
        res.writeHead(404,HEADERS.text);
        res.write("Errore persona non trovata");
         res.end();
    }     
})



//questo file è il main