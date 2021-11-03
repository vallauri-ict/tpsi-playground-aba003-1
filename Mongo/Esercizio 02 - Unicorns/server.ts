"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import * as _mongodb from  "mongodb"
import { HEADERS } from "./headers";


const mongoClient =_mongodb.MongoClient;
const CONNECTIONSTRING ="mongodb://127.0.0.1:27017";
const DBNAME ="5B";
/*const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) { 
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);*/

/**QUERY 1 **/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({weight:{$lte:800,$gte:700}}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 1: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/**QUERY 2 **/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({$and:[{gender:'m'},{loves:'grape'},{vampires:{$gte:60}}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 2: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/**QUERY 3  $in si apetta un vettore enumerativo di parametri  **/ 
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({$and:[{gender:'m'},{loves: {$in:['grape','apple']}},{vampires:{$gte:60}}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 3: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/**QUERY 4  $or   **/ 
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({$or:[{gender:'f'},{weight:{$lte:700}}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 4: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/**QUERY 5 **/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({$and:[{loves:{$in:["apple","grape"]}},{vampires:{$gte:60}}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 5: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/** QUERY 6**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({loves:{$all:["apple","watermelon"]}}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 6: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/** 7**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({$or:[{hair:'brown'},{hair:'grey'}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 7: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/** 7bis**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({hair:{$in:['brown','grey']}}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 7bis: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/** 8   funziona anche con {$and:[{vaccinated:true}]} **/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({$and:[{vaccinated:{$exists:true}}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 8: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

/** 9  regex **/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    let regex = new RegExp("^A","i");
    collection.find({$and:[{name:regex},{gender:'f'}]}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 9: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

//**Query 10**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({ _id: new _mongodb.ObjectId('6182393d6b386f16673b9e7c')}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 10: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

//**Query 11  project**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({gender:'m'}).project({"name":1,vampires:1,_id:0}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 11: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

//**Query 11bis sort -1 in ordine decrescente 1 in ordine crescente piu campi fa il primo e a parimerito fa il 2**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({gender:'m'}).project({"name":1,vampires:1,_id:0}).sort({vampires:-1,name:1}).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 11bis: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

//**Query 11bisbis skip limit**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({gender:'m'}).project({"name":1,vampires:1,_id:0}).sort({vampires:-1,name:1}).limit(3).toArray((err,data)=>{
      if (!err) { 
        console.log("Query 11bisbis: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})


//**Query 12 count**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.find({weight:{$gte:500}}).count((err,data)=>{
      if (!err) { 
        console.log("Query 12: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

//**Query 13 findone**/
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db(DBNAME);
    let collection =db.collection("unicorns");
    collection.findOne({name:"Aurora"},{projection:{name:1,weight:1,hair:1}},(err,data)=>{
      if (!err) { 
        console.log("Query 13: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    })

  }
  else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})







