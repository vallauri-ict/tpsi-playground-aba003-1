import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING ="mongodb+srv://edoardo:aba@cluster0.7z0jw.mongodb.net/5B?retryWrites=true&w=majority"

const DB_NAME = "5B";


let port : number = 1337;
let app = express();

let server = http.createServer(app);

server.listen(port,function(){

    console.log("Server in ascolto sulla porta " + port)

    init();
});



//error page
let paginaErrore="";
function init(){
    fs.readFile("./static/error.html",function(err, data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h2>Risorsa non trovata</h2>";
        }
    });
}


//****************************************************************
//elenco delle routes di tipo middleware
//****************************************************************

// 1.log 
app.use("/",function(req, res, next){
    console.log("---->" + req.method + ":"+ req.originalUrl);
    next();
});

// 2.static route
app.use("/", express.static("./static"));

// 3.route lettura parametri non get
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({"extended":true}));

// 4.log parametri
app.use("/", function(req, res, next){
    if(Object.keys(req.query).length > 0){
        console.log("Parametri GET: ",req.query);
    }
    if(Object.keys(req.body).length > 0){
        console.log("Parametri BODY: ",req.body);
    }
    next();
})


//****************************************************************
//elenco delle routes di risposta al client
//****************************************************************
// middleware di apertura della connessione
app.use("/api/", (req, res, next) => {
    mongoClient.connect(CONNECTION_STRING, (err, client) => {
      if (err) {
        res.status(503).send("Db connection error");
      } else {
        console.log("Connection made");
        req["client"] = client;
        next();
      }
    });
  });

  
app.get("/api/getCollections",(req,res,next)=>{
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let request = db.listCollections().toArray();
    
    request.then(data=>res.send(data));
    request.catch(()=>res.status(503).send("Oops somthing went wrong :("));
    request.finally(()=>req["client"].close());
})

let currentCollection="";
let currentId="";

app.use("/api/:collection/:id?",(req,res,next)=>{ //intercept the collection because the app.get does not send params
    currentCollection= req.params.collection;
    currentId= req.params.id;
    next();
})

app.get("/api/*",(req,res,next)=>{ //app.get reply on the exact match of the resource so we need to add *
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection(currentCollection);

  let request = collection.find(req.query).toArray();
  
  request.then(data=>res.send(data));
  request.catch(()=>res.status(503).send("Oops somthing went wrong :("));
  request.finally(()=>req["client"].close());

})

app.post("/api/*",(req,res,next)=>{
    let jsonToInsert = req["body"].json;

    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
  
    let request = collection.insertOne(jsonToInsert)
    
    request.then(data=>res.send(data));
    request.catch(()=>res.status(503).send("Oops somthing went wrong :("));
    request.finally(()=>req["client"].close());
    
})

app.delete("/api/*",(req,res,next)=>{

    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);

    let request= collection.deleteOne({"_id": new mongodb.ObjectId(currentId)})
    request.then(data=>res.send(data));
    request.catch(()=>res.status(503).send("Oops somthing went wrong :("));
    request.finally(()=>req["client"].close());

})

app.patch("/api/*",(req,res,next)=>{

    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);

    let request= collection.updateOne({"_id": new mongodb.ObjectId(currentId)},{$set:req["body"].json})
    request.then(data=>res.send(data));
    request.catch(()=>res.status(503).send("Oops somthing went wrong :("));
    request.finally(()=>req["client"].close());

})

app.put("/api/*",(req,res,next)=>{

    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);

    let request= collection.replaceOne({"_id":new mongodb.ObjectId(currentId)},req["body"].json);
    request.then(data=>res.send(data));
    request.catch(()=>res.status(503).send("Oops somthing went wrong :("));
    request.finally(()=>req["client"].close());

})
  

//****************************************************************
//default route(risorse non trovate) e route di gestione degli errori
//****************************************************************
app.use("/", function(err, req, res, next){
    console.log("***************  ERRORE CODICE SERVER ", err.message, "  *****************");
})



