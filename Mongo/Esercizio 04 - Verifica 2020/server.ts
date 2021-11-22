"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import * as _mongodb from "mongodb"
import { HEADERS } from "./headers";


const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";
const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);


dispatcher.addListener("POST", "/api/servizio01", (req, res) => {
  let dateStart = new Date(req.BODY.dateStart);
  let dateEnd = new Date(req.BODY.dateEnd);


  mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("vallauri");
      collection.find({ "$and": [{ "dob": { "$gte": dateStart, "$lte": dateEnd } }] }).project({ nome: 1, classe: 1 }).toArray((err, data) => {
        if (!err) {
          res.writeHead(200, HEADERS.json);
          res.write(JSON.stringify(data));
          res.end();
        } else {
          res.writeHead(500, HEADERS.text);
          res.write(err);
          res.end();
        }
        client.close();
      })
    } else {
      console.log("Errore connessione al db");
    }
  });

})


//query 1

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    let req = collection.aggregate([{
      $project:
      {
        nome: 1,classe:1, italiano: { $avg: "$italiano" },
        matematica: { $avg: "$matematica" },
        informatica: { $avg: "$informatica" },
        sistemi: { $avg: "$sistemi" },
      }
    }, {
      $project: {
        nome: 1,classe:1, mediaTot: { $avg: ["$italiano", "$matematica", "$informatica", "$sistemi"] }
      }
    },{$group:{_id:"$classe",mediaClasse:{$avg:"$mediaTot"}}},{$project:{_id:1,mediaClasse:{$round:["$mediaClasse",2]}}}
    //,{$group:{_id:{}, mediaClassi:{$avg:"$mediaClasse"}}}
  
  ]).toArray();
    req.then(function (data) {
      console.log("Query 1", data);
    });
    req.catch(function (err) {
      console.log("Errore esecuzione query " + err.message);
    })
    req.finally(function () {
      client.close();
    })
  }
  else {
    console.log("Errore nella connessione al DB " + err.message);
  }
});



//query 2
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    collection.updateMany({$and:[{genere:"f"},{classe:"4A"}]},{$push:{informatica:7 as never  }},
      (err, data) => {
        if (!err) {
          console.log("Query 2", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db");
  }
});

//query 3
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    collection.deleteMany({sistemi:{$in:[3]}},
      (err, data) => {
        if (!err) {
          console.log("Query 3", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db");
  }
});

//query 4
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    collection.aggregate([
      {$group:{_id:"$classe",giorniAssenza:{$sum:"$assenze"}}},{$sort:{giorniAssenza:-1}}
    
    
    
    ]).toArray(
      (err, data) => {
        if (!err) {
          console.log("Query 4", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db");
  }
});






