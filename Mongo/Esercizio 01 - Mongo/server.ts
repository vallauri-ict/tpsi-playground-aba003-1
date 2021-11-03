"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import * as _mongodb from  "mongodb"
import { HEADERS } from "./headers";

const mongoClient =_mongodb.MongoClient;
const CONNECTIONSTRING ="mongodb://127.0.0.1:27017";
/*const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) { 
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);*/


//CREA UN RECORD NEL DB
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db("Students");
    let collection =db.collection("Studenti");
    let student = {"nome":"Luca","indirizzo":"Neive","residenza":{"citta":"genola","provincia":"cuneo","cap":12058},"studente":true,"hobbies":["calcio","Pallavolo"]}
    collection.insertOne(student,(err,data)=>{
      if (!err) {
        console.log("Create: " , data)
      }else{

      }
      client.close();
    });
   
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})
//VISUALIZZA IL DB
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db("Students");
    let collection =db.collection("Studenti");
    collection.find().toArray((err,data)=>{
      if (!err) {
        console.log("Find: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });

    
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})
//UPDATE
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db("Students");
    let collection =db.collection("Studenti");
    collection.updateOne({"nome":"Lorenzo"},{$set:{"citta":"Pisnelino"}}),((err,data)=>{
      if (!err) {
        console.log("Update: ", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });

    
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})

//DELETE
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db=client.db("Students");
    let collection =db.collection("Studenti");
    collection.deleteMany({"nome":"Lorenzo"}),((err,data)=>{
      if (!err) {
        console.log("Delete", data);
      }else{
        console.log("Errore nella esecuzione della query: " +err.message)
      }
      client.close();
    });

    
  }else{
    console.log("Errore nella connessione al database:" + err.message);
  }
})







