import express from "express";
import * as http from "http";
import * as fs from "fs";
import * as body_parser from "body-parser";
import HEADERS from "./headers.json";
import * as mongodb from "mongodb";
import cors from "cors";


// munga
const mongo_client = mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb+srv://edoardo:aba@cluster0.7z0jw.mongodb.net/recicipebook?retryWrites=true&w=majority"
const DBNAME = "recicipebook";

const PORT: number = 1337;
let app = express();

let server = http.createServer(app);

// questa collback va in esecuzione quando il server ascolta  0
server.listen(PORT, () => {
    console.log("Server in ascolto sulla porta " + PORT);
    init();
});

let pagina_errore = "";
let init = () => {
    fs.readFile("./static/error.html", (err, data) => {
        if (!err) {
            // data è un buffer, occorre serializzarlo
            pagina_errore = data.toString();
        } else {
            pagina_errore = "<h2>Risorsa non trovata</h2>";
        };
    });
};






/* ******************************************************************
                elenco delle route di tipo middleware
   ****************************************************************** */
// 1 - log
app.use("/", (req, res, next) => {
    console.log(" -----> " + req.method + " : " + req.originalUrl);
    next();
});

// 2 - static-route
// .static va a cercare la risorsa all'interno
// della cartella static
app.use("/", express.static("./static"));

// 3 - route di lettura dei parametri post
app.use("/", body_parser.json());
// extend fa in modo che vengano intercettati
// eventuali json all'interno del body
app.use("/", body_parser.urlencoded({ "extended": true }));

// 4 - log dei parametri
app.use("/", (req, res, next) => {
    if (Object.keys(req.query).length) {
        console.log("parametri GET: ", req.query);
    }

    if (Object.keys(req.body).length) {
        console.log("parametri BODY: ", req.body);
    };
    next();
});

//gestione richieste cors
const whitelist = ["http://localhost:4200", "http://localhost:1337"];
const corsOptions = {
 origin: function(origin, callback) {
 if (!origin)
 return callback(null, true);
 if (whitelist.indexOf(origin) === -1) {
 var msg = 'The CORS policy for this site does not ' +
 'allow access from the specified Origin.';
 return callback(new Error(msg), false);
 }
 else
 return callback(null, true);
 },
 credentials: true
};
app.use("/", cors(corsOptions));




/* ******************************************************************
               elenco delle route di risposta al client
   ****************************************************************** */
//middelware che apre la connessione non lo cambiamo mai

//fa getcollection
//intercetta i parametri
//ritorna gli unicorni

app.use("/", (req, res, next) => {
    mongo_client.connect(CONNECTIONSTRING, (err, client) => {
        if (err) {
            res.status(503).send("Errore di connessione al database");
        } else {
            console.log(">>>>>> CONNESSIONE ESEGUITA CORRETTAMENTE");
            req["client"] = client;
            next();
        }
    });
});

app.patch("/api/servizio2", function (req, res, next) {
    let unicorn = req.body.name;
    let incVampires = req.body.vampires;
    if (unicorn && incVampires) {
        let db = req["client"].db(DBNAME) as mongodb.Db;
        let collection = db.collection("unicorns");

        let request = collection.updateOne({ "name": unicorn }, { "$inc": { "vampires": incVampires } });

        request.then((data) => {
            res.send(data);
        });

        request.catch((err) => {
            res.status(503).send("Errore nella query");
        });

        request.finally(() => {
            req["client"].close();
        });
    } else {
        res.status(400).send("Parametro mancante: nome unicorno o incremento vampiri");
        req["client"].close();
    };
});

app.get("/api/servizio3/:gender/:hair", function (req, res, next) {
    let gender = req.params.gender;
    let haiir = req.params.hair;


    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection("unicorns");

    let request = collection.find({ $and: [{ gender: gender }, { hair: haiir }] }).toArray();

    request.then((data) => {
        res.send(data);
    });

    request.catch((err) => {
        res.status(503).send("Errore nella query");
    });

    request.finally(() => {
        req["client"].close();
    });

});

//lettura dellla collezioni presenti nel db
app.get("/api/getCollections", function (req, res, next) {

    //req["client salviamo il client per le connessioni successive"] 
    //l' oggetto che destisce la connessione con mogno
    let db = req["client"].db(DBNAME) as mongodb.Db;

    let request = db.listCollections().toArray();

    request.then((data) => {
        res.send(data);
    });

    request.catch((err) => {
        res.status(503).send("Errore nella query");
    });

    request.finally(() => {
        req["client"].close();
    });


});

///middleware per  l' intercettazione dei parametri e deve settare queste 2 variabili
let currentCollection;
let currentId;
//con o senza id l' id diventa facoltativo 
app.use("/api/:collection/:id?", (req, res, next) => {
    currentCollection = req.params.collection
    currentId = req.params.id
    next();
})


//ascolta su tutte le richieste get
app.get("/api/*", function (req, res, next) {


    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection); //currentColletion è una stringa

    if (!currentId) {
        let request = collection.find().toArray();//mando solo quello che uso

        request.then((data) => {
            res.send(data);
        });

        request.catch((err) => {
            res.status(503).send("Errore nella query");
        });

        request.finally(() => {
            req["client"].close();
        });
    } else {

        let objectId = new mongodb.ObjectId(currentId);
        let request = collection.findOne({ _id: objectId })

        request.then((data) => {
            res.send(data);
        });

        request.catch((err) => {
            res.status(503).send("Errore nella query");
        });

        request.finally(() => {
            req["client"].close();
        });
    }
});

app.post("/api/*", function (req, res, next) {


    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection); 

        let request = collection.insertOne(req["body"]);
        request.then((data) => { //questo data conterra il messaggio di conferma dell'inserimento
            res.send(data);
        });

        request.catch((err) => {
            res.status(503).send("Errore nella query");
        });

        request.finally(() => {
            req["client"].close();
    });
})

app.delete("/api/*", function (req, res, next) {


    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection); 

        let id=new mongodb.ObjectId(currentId); //l' idi è intecettato
        let request = collection.deleteOne({"_id":id});
        request.then((data) => { //questo data conterra il messaggio di conferma dell'inserimento
            res.send(data);
        });

        request.catch((err) => {
            res.status(503).send("Errore nella query");
        });

        request.finally(() => {
            req["client"].close();
        });


})

app.patch("/api/*", function (req, res, next) {


    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection); 

        let id=new mongodb.ObjectId(currentId); //l' idi è intecettato
        let request = collection.updateOne({"_id":id},{$set:req.body});
        request.then((data) => { //questo data conterra il messaggio di conferma dell'inserimento
            res.send(data);
        });

        request.catch((err) => {
            res.status(503).send("Errore nella query");
        });

        request.finally(() => {
            req["client"].close();
        });


})











/* ******************************************************************
   default route (risorsa non trovata) e route di gestione degli errori
   ****************************************************************** */
app.use("/", (req, res, next) => {
    res.status(404);
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovato");
    } else {
        res.send(pagina_errore);
    };
});