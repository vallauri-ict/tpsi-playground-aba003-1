
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
let PORT = 1337;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
  //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);


//********************registrazione dei servizi*****************************
dispatcher.addListener("POST", "/api/like", function (req, res) {
  let nome = req["BODY"].radio

  for (const radio of radios) {
    if (radio.name == nome) {
      let num = parseInt(radio.votes)
      num++;
      radio.votes = num.toString();
      _fs.writeFile("./radios.json", JSON.stringify(radios), function (err) {
        if (err) {
          res.writeHead(404, HEADERS.text);
          res.write(err);
        }
        else {
          res.writeHead(200, HEADERS.json);
          res.write(JSON.stringify(radio.votes));
        }
        res.end();
      })
      break;

    }
  }

})

dispatcher.addListener("GET", "/api/radios", function (req, res) {
  let state = req["GET"].state
  let arrRadios = [];
  if (state == 'tutti') {
    for (const radio of radios) {
      arrRadios.push(radio);
    }
  } else {
    for (const radio of radios) {
      if (radio.state == state) {
        arrRadios.push(radio);
      }
    }

  }
  res.writeHead(200, HEADERS.json)
  res.write(JSON.stringify(arrRadios));
  res.end();


})

dispatcher.addListener("GET", "/api/elenco", function (req, res) {
  res.writeHead(200, HEADERS.json)
  res.write(JSON.stringify(states));
  res.end();

})
dispatcher.addListener("GET", "/api/update", function (req, res) {

  zeroCount();
  for (const radio of radios) {
    for (const state of states) {
      if (radio.state == state.name) {
        let num = parseInt(state.stationcount)
        num++;
        state.stationcount = num.toString();
      }
    }
  }
  writeOnDisk();

  function zeroCount() {
    for (const state of states) {
      let num = 0
      state.stationcount = num.toString();
    }
    writeOnDisk();

  }

  function writeOnDisk() {
    _fs.writeFile("./states.json", JSON.stringify(states), function (err) {
      if (err) {
        res.writeHead(404, HEADERS.text);
        res.write(err);
      }
      else {
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify("Json salvato correttamente su disco"));
      }
      res.end();
    })
  }
})
