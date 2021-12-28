import * as http from "http";
import * as fs from "fs";
import express from "express";
import * as bodyParser from "body-parser";

// MongoDB
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"; accesso locale
// accesso ad Atlas:
const CONNECTIONSTRING = "mongodb+srv://edoardo:aba@cluster0.7z0jw.mongodb.net/5B?retryWrites=true&w=majority"
const DB_NAME = "5B";


let port : number = 1337;
let app = express();

let server = http.createServer(app);

server.listen(port,()=>{
    console.log("server in ascolto sulla porta: " + port);
    init();
});

let paginaErrore = "";

function init(){
    fs.readFile("./static/error.html",function(err,data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h2> Risorsa non trovata </h2>";
        }
    });
}


// **********************************************************************
// Elenco delle routes di tipo Middleware
// **********************************************************************
// 1. log
app.use("/", function (req, res, next) {
    console.log(" -----> " + req.method + ":" + req.originalUrl);//in method i have the methond of the call 
    next(); 
});

// 2. static route
// esegue il next automaticamente quando non trova la risorsa
//vede se all' interno della risorsa specificata cè quello che abbiamo richiesto e lo returna altrimenti fa next
app.use("/", express.static("./static")); //gestione dele risorse statiche è asincrona infatto logga sotto i parametri get prima di restituire


// 3. route di lettura parametri non get si troveranno in req.body
app.use("/", bodyParser.json()); // intercetta i parametri in formato json
app.use("/", bodyParser.urlencoded({"extended":true})); // parametri body

// 4. log dei parametri
app.use("/",function(req,res,next){
    if(Object.keys(req.query).length > 0){
        console.log("      Parametri GET: ",req.query);
    }
    if(Object.keys(req.body).length > 0){
        console.log("      Parametri BODY: ",req.body);
    }
    next();
});

// **********************************************************************
// Elenco delle routes di risposta al client
// **********************************************************************
//stringa di connessione
app.use("/api/",function (req,res,next){
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
        if(err){
            res.status(503).send("Errore nella connessione al DB");
        }
        else{
            console.log("Connected succesfully");
            req["client"] = client;//ci salviamo il client per le route successive  e per il client cose 
            next();
        }
    });
});

app.get("/api/servizio1",function(req,res,next){
        let unicorn = req.query.nome;
        if(unicorn)
        {
            let db = req["client"].db(DB_NAME) as _mongodb.Db;
            let collection = db.collection("unicorns");
            let request = collection.find({"name":unicorn}).toArray();
            
            request.then(data=>res.send(data))
            request.catch(()=>res.status(503).send("Errore esecuzione query"))
            request.finally(()=>req["client"].close())
        }
        else
        {
            res.status(400).send("Parametro mancante: UnicornName");
            req["client"].close();
        }
    
   
});

app.patch("/api/servizio2",function(req,res,next){
    let unicorn = req.body.nome;
    let incVampires = req.body.vampires;
    if(unicorn && incVampires)
    {
        let db = req["client"].db(DB_NAME) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.updateOne({"name":unicorn},{$inc:{vampires:incVampires}});

        request.then(data=>res.send(data))
        request.catch(()=>res.status(503).send("Errore esecuzione query"))
        request.finally(()=>req["client"].close())
    }
    else
    {
        res.status(400).send("Parametro mancante: name o vampires");
        req["client"].close();
    }
});

app.get("/api/servizio3/:gender/:hair",function(req,res,next){
    let gender = req.params.gender; //params dove si trova nella risorsa se non la passo con gli / nell url
    let hair = req.params.hair;
    // la if sull'esistenza dei parametri non serve perchè
    // se non c'è un match esatto nell'url non entra neanche nel servizio
        let db = req["client"].db(DB_NAME) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.find({"$and":[{"gender":gender},{"hair":hair}]}).toArray();
        
        request.then(data=>res.send(data))
        request.catch(()=>res.status(503).send("Errore esecuzione query"))
        request.finally(()=>req["client"].close())
});

// **********************************************************************
// Default route (risorsa non trovata) e route di gestione degli errori 
// **********************************************************************
app.use("/", function (req, res, next) {  //route ch erisponde se tutte le altre non hanno dato un esito
    res.status(404);
    if(req.originalUrl.startsWith("/api/")){
        res.send("Risorsa non trovata");
    }
    else{
        res.send(paginaErrore);
    }
});

app.use(function(err, req, res, next) {
    console.log("Errore codice server",err.message)
});