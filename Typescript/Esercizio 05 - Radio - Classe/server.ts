
import { prototype } from 'events';
import *  as _http from 'http';
import { json } from 'stream/consumers';
import { HEADERS } from "./headers";
import { Dispatcher } from './dispatcher';
import radios from './radios.json';
import states from "./states.json";
import * as _fs from 'fs';
import * as _mime from 'mime';
import { parse } from 'path/posix';

let dispatcher = new Dispatcher();
let PORT = 1338;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
  //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);

resetToZero();
initRadiosCount();

dispatcher.addListener("GET","/api/elenco",function (req,res) {

  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify(states));
  res.end();
  
})
dispatcher.addListener("GET","/api/radios",function (req,res) {
  let regione= req.GET.regione
  console.log(regione)
  let arr=[];
  if (regione=='tutti') {
    for (const radio of radios) {
        arr.push(radio);
    }
  }else{
    for (const radio of radios) {
      if (radio.state==regione) {
        arr.push(radio);
      }
    }
  }
  
 
  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify(arr));
  res.end();
  
})

dispatcher.addListener("POST","/api/like",function (req,res) {

  let idRadio= req.BODY.idRadio

  for (const radio of radios) {
    if (radio.id==idRadio) {
      let vote= parseInt(radio.votes);
      vote++;
      radio.votes=vote.toString();
      _fs.writeFile("./radios.json",JSON.stringify(radios),function (err) {
        if (!err) {
          console.log("ok");
        }
      })
      res.writeHead(200,HEADERS.json);
      res.write(JSON.stringify({"ris":radio.votes}));
      res.end();
    }
  }

 
  
})



function resetToZero (){
    for (const iterator of states) {
      iterator.stationcount ='0';
    }

    _fs.writeFile("./states.json",JSON.stringify(states), function (err) {
      if(!err){
          console.log("States aggiornato correttamente");
      }
    })
}

function initRadiosCount() {

    for (const iterator  of states) {
      for (const radio of radios) {
        if (iterator.name==radio.state) {
            let num =parseInt(iterator.stationcount);
            num++;
            iterator.stationcount=num.toString();
        } 
      }
    }
    _fs.writeFile("./states.json",JSON.stringify(states),function (err) {
      if (!err) {
        console.log("ok");
      }
    })
}