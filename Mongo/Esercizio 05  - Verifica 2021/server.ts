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


dispatcher.addListener("GET", "/api/getIds", (req, res) => {

  mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("facts");
      collection.aggregate([{ $project: { _id: 1, value: 1 } }]).toArray((err, data) => {
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

dispatcher.addListener("POST", "/api/update", (req, res) => {

  let _id = req.BODY._id;
  let _textChange = req.BODY._textChanged;
  let currentDate = new Date();
  mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("facts");
      collection.updateOne(
        { _id: _id }, { $set: { value: _textChange, created_at: currentDate } }, (err, data) => {
          if (!err) {
            res.writeHead(200, HEADERS.json);
            res.write(JSON.stringify({ "ris": "ok" }));
            res.end();
          } else {
            res.writeHead(500, HEADERS.text);
            res.write(err);
            res.end();
          }
          client.close();
        }
      );
    } else {
      console.log("Errore connessione al db");
    }
  });
})


//query 2
/*
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("facts");
      let req = collection.find({ $or:[{categories:{$in:["music"]}},{score:{$gte:620}}] }).project({_id:1,categories:1,score:1}).toArray((err, data) => {
        if (!err) {
          console.log("Query 2 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      })
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});*/


//query 3
/*
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("facts");

    const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]
    let _id;
    for (let index = 0; index < 22; index++) {

      _id += base64Chars[Math.floor(Math.random() * base64Chars.length)];
    }
    let id=_id.slice(9); //mostra un undefined

    let fact = {"_id":id,"icon_url":"fixed","url":`fixed${id}`,"created_at":new Date(),"score":0,"value":"I'm inserting a new chucknorris's fact"}
    collection.insertOne(fact,(err,data)=>{
      if (!err) {
        console.log("Create: " , data)
      }else{

      }
      client.close();
    });
  }
});
*/
//query 4
/*
mongoClient.connect(CONNECTIONSTRING,function (err,client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("facts");
    collection.deleteMany({$and:[{created_at:{$gte:"2021-11-15"}},{score:0}]}),((err,data)=>{
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
})*/

/*
//query 5
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("facts");
      let req = collection.aggregate([
          {"$project":{"categories":1,"score":1,_id:0}},
          {"$unwind":"$categories"},{$group:{_id:"$categories",mediaScore:{$avg:"$score"}}},{$project:{ mediaScore:{$round:["$mediaScore",2]}}},{$sort:{mediaScore:-1,_id:1}} 
      ]).toArray();
      req.then(function(data){
          console.log("Query 5",data);
      });
      req.catch(function(err){
          console.log("Errore esecuzione query " + err.message);
      })
      req.finally(function(){
          client.close();
      })
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});
*/



//query 6a 
/*
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("facts");
      let req = collection.aggregate([
          {"$project":{"categories":1,_id:0}},
          {"$unwind":"$categories"},{$group:{_id:"$categories"}} 
      ]).toArray();
      req.then(function(data){
          console.log("Query 6a",data);
      });
      req.catch(function(err){
          console.log("Errore esecuzione query " + err.message);
      })
      req.finally(function(){
          client.close();
      })
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});


//query 6b
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("facts");
      let req = collection.aggregate([
          {"$project":{"categories":1,_id:0}},
          {"$unwind":"$categories"},{$group:{_id:"$categories"}},{$sort:{_id:1}}
      ]).toArray();
      req.then(function(data){
          console.log("Query 6b",data);
      });
      req.catch(function(err){
          console.log("Errore esecuzione query " + err.message);
      })
      req.finally(function(){
          client.close();
      })
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});*/











