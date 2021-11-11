"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import * as _mongodb from "mongodb"
import { HEADERS } from "./headers";
import { match } from 'assert'


const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
/*const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) { 
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);*/


mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");


    const promise1 = new Promise(() => {

      /**Query 1 */
      //con $group il recordset risultante avrà solo 2 colonne che sono _id e totale tutti gli altri campi non sono piu visibili
      //il nome dei campi se sono usati a detsra va il $ se no non ci va
      let request = collection.aggregate([
        { "$match": { "status": "A" } },
        { "$group": { "_id": "$cust_id", "totale": { "$sum": "$amount" } } },
        { "$sort": { "totale": -1 } }
      ]).toArray();

      request.then((data) => {
        console.log("QUERY 1: ", data);
      });

      request.catch((err) => {
        console.error("Errore esecuzione query: " + err.message);
      });

      /**Query 2 */

      

    });

    promise1.catch((error) => {
      console.error(error);
    });
    promise1.finally(() => {
      client.close();
    })

  } else {
    console.log("Errore connessione al db");
  }
});



