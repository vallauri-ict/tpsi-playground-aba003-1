"use strict"

import  express from "express";
import * as bodyParser from 'body-parser';
import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from "mongodb"


const app =  express();

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";
const PORT = 1337; 

const server = _http.createServer(app);

server.listen(PORT,()=>{
  console.log("Server in ascolto sulla porta: " + PORT);
  init()
});


let paginaErrore="";
function init() {
    //vado a leggermi la pagina di errore e me la tengo in memoria e in caso di errore la mandiamo subito
    _fs.readFile("./static/error.html",(err,data)=>{
      if (!err) {
        paginaErrore=data.toString(); //va messo a string prvhè lo restituisce in byte
      }else{
        paginaErrore="<h2>Risorsa non trovata</h2>";
      }
    })

}



//******************************************************
//registrazione delle route di tipo middleware
//******************************************************

//1 log richiesta
app.use("/",(req,res,next)=>{
  console.log("=>" + req.method + ":" + req.originalUrl);
  next();
})

//2 static route
app.use("/",express.static("./static")) //va a cercare se la risorsa che ho chiesto in ./static se non la trova fa next 

//3 route di lettura dei parametri post
app.use("/",bodyParser.json()) //intercetta i parametri body json
app.use("/",bodyParser.urlencoded({"extended":true})) //intercetta i parametri body urlencoded

//4 log dei parametri
app.use("/",(req,res,next)=>{
  if (Object.keys(req.query).length>0) {
    console.log("Parametri GET: " , req.query);
  }

  if (Object.keys(req.query).length>0) { 
    console.log("Parametri BODY: " , req.body);
  }

  next();
})
//******************************************************
//registrazione delle route di risposta al cliente
//******************************************************

//qui next non serve qui si risponde e basta
app.get("/api/risorsa1",(req,res,next)=>{
  let nome = req.query.nome;
  res.send({"nome": nome});
})

app.post("/api/risorsa1",(req,res,next)=>{
  let nome = req.body.nome;
  res.send({"nome": nome});
})


//******************************************************
//default route e route di gestione degli errori
//******************************************************

//risponde per le risorse non trovate
app.use("/",(req,res,next)=>{
  res.status(404);

  //risorsa del client che ha chiesto
  if (req.originalUrl.startsWith("/api/")) {
    res.send("Risorsa non trovata");
  }else{
    res.send(paginaErrore);
  }
})









