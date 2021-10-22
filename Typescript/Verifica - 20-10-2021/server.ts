"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import facts from "./facts.json";

import { HEADERS } from "./headers";


let dispatcher = new Dispatcher();
let PORT = 1337;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
  //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);

/* ********************** */

// const categories = []


const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]


dispatcher.addListener("GET", "/api/elenco", function (req, res) {
  let categories = [];
  for (const fact of facts.facts) {
    for (const iterator of fact.categories) {
      if (!categories.includes(iterator)) {
        categories.push(iterator);
      }
    }
  }
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify(categories));
  res.end();
})

dispatcher.addListener("GET", "/api/facts", function (req, res) {
  let category = req.GET.category;
  let arr = [];
  for (const iterator of facts.facts) {
    if (iterator.categories.includes(category)) {
      arr.push(iterator);
    }
  }
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify(arr));
  res.end();
})
dispatcher.addListener("POST", "/api/rate", function (req, res) {
  let ids = req.BODY.ids;
  for (const iterator of facts.facts) {
    for (const id of ids) {
      if (iterator.id == id) {
        iterator.score++;
      }
    }

  }
  _fs.writeFile("./facts.json", JSON.stringify(facts), function (err) {
    if (!err) {
      res.writeHead(200, HEADERS.json);
      res.write(JSON.stringify({ "ris": "ok" }));
      res.end();
    }
  })

})

dispatcher.addListener("POST", "/api/add", function (req, res) {

  req.BODY["icon_url"] = icon_url;
  req.BODY["api_url"] = api_url;
  let allId = [];
  for (const iterator of facts.facts) {
    allId.push(iterator.id);
  }
  let id
  do {
    id= create()
  } while (allId.includes(id));
  req.BODY["id"] = id.substring(9);
  
  facts.facts.push(req.BODY)

  _fs.writeFile("./facts.json", JSON.stringify(facts), function (err) {
    if (!err) {
      res.writeHead(200, HEADERS.json);
      res.write(JSON.stringify({ "ris": "ok" }));
      res.end();
    }
  })

})

function create() {
  let id;
  for (let index = 0; index < 22; index++) {
    id += base64Chars[Math.floor(Math.random() * base64Chars.length)];
  }
  return id;
}


