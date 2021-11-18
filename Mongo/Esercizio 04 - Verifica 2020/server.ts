"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import * as _mongodb from "mongodb"
import { HEADERS } from "./headers";


const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) { 
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);


dispatcher.addListener("POST","/api/servizio01",(req,res)=>{
  let dateStart= new Date(req.BODY.dateStart) ;
  let dateEnd= new Date(req.BODY.dateEnd) ;
  

  mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
      let db = client.db(DBNAME);
      let collection = db.collection("vallauri");
      collection.find({"$and":[{"dob":{"$gte":dateStart,"$lte":dateEnd}}]}).project({nome:1,classe:1}).toArray( (err, data) => {
        if (!err) {
          res.writeHead(200,HEADERS.json);
          res.write(JSON.stringify(data));
          res.end();
        } else {
          res.writeHead(500,HEADERS.text);
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




