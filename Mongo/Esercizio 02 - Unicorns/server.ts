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
/*const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) { 
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);*/

// query 1  Trovare gli unicorni che hanno un peso compreso tra 700 e 800
// $lte: 800 , $gte:700 corrispondono a minore e maggiore di  .toarray così lo convertiamo in enumerativo
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({ weight: { $lte: 800, $gte: 700 } }).toArray((err, data) => {
      if (!err) {
        console.log("Query 1 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})


// query 2 Trovare gli unicorni di genere maschile che amano l’uva echehanno ucciso più di 60 vampir
//$and accetta un vettore con tanti json dento come condizione dell' end
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $and: [{ vampires: { $gte: 60 } }, { gender: "m" }, { loves: "grape" }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 2 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 2 bis Trovare gli unicorni di genere maschile che amano l’uva echehanno ucciso più di 60 vampir
//$in accetta un vettore e significa se ama o l' uva o l' anguria
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $and: [{ vampires: { $gte: 60 } }, { gender: "m" }, { loves: { $in: ["grape", "watermelon"] } }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 2bis - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 3 Trovare gli unicorni di genere femminile ochepesano meno di 700 kg
//$or come and le consizioni della or
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $or: [{ gender: "f" }, { weight: { $lte: 700 } }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 3 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 4 Trovare gli unicorni che amano (l’uva o le mele) echehanno ucciso più di 60 vampiri
// $in agisce da or preticamente restituisce i campi se amano l uva o le mele 
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $and: [{ vampires: { $gte: 60 } }, { loves: { $in: ["grape", "apple"] } }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 4 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 5 Trovare gli unicorni che amano (l’uva ele anguria) echehanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ loves: ["grape", "watermelon"] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 5 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 5bis 
//$all unicorni che amano sia le mele che le arance tutte le voci del vettore passato
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ loves: { $all: ["grape", "watermelon"] } })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 5bis - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 6 Trovare gli unicorni che hanno il pelo marrone oppure grigio
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $or: [{ hair: "grey" }, { hair: "brown" }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 6 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 6 bis con la $in
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ hair: { $in: ["grey", "brown"] } })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 6 bis - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 7
//$exists Può essere usato per verificare la presenza o l‟assenza di un campo. 
//basta solo .find({vaccinated:true})
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $and: [{ vaccinated: true }, { vaccinated: { $exists: true } }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 7 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 9 Trovare gli unicorni di genere femminile il cui nome inizia con la lettera A
//nomecambpo:{$reegx:regex}
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let regex = new RegExp("^A", "i");
    collection
      .find({ $and: [{ "name": { "$regex": regex } }, { gender: "f" }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 9 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


// query 10 Trovare un unicorno sulla base dell’ID
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ _id: new _mongodb.ObjectId("61823940801d3dfa6c72ec32") }) //bisogna istanziare un oggetto ongect id
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 10 - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});


/*
// query 11 a
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ gender: "m" })
      .project({ name: 1, vampires: 1, _id: 0 })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 11a - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});

// query 11 b
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ gender: "m" })
      .project({ name: 1, vampires: 1, _id: 0 })
      .sort({ vampires: -1, name: 1 })
      .skip(1)
      .limit(3)
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 11b - ", "N record: " + data.length, data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db");
  }
});

// query 12
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({ weight: { $gt: 500 } }).count(function (err, data) {
      if (!err) {
        console.log("Query 12", data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    });
  } else {
    console.log("Errore connessione al db");
  }
});

// query 13
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.findOne(
      { name: "Aurora" },
      { projection: { weight: 1, hair: 1 } },
      (err, data) => {
        if (!err) {
          console.log("Query 13 ", data);
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

// query 14
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.distinct("loves", { gender: "f" }, (err, data) => {
      if (!err) {
        console.log("Query 14 ", data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    });
  } else {
    console.log("Errore connessione al db");
  }
});

// query 15
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.insertOne(
      { name: "pippo", gender: "m", loves: ["apple", "lemon"] },
      (err, data) => {
        if (!err) {
          console.log("Query 15 ", data);
          collection.deleteMany({ "name": "pippo" }, (err, data) => {
            if (!err) {
              console.log("Query 15b", data);
            } else {
              console.log("Errore esecuzione query");
            }
          });
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

// query 16
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.updateOne(
      { name: "pilot" },
      { $inc: { vampires: 1 } }, // se vampires non esiste crea lui il campo
      { "upsert":true }, // se record pluto non esiste viene creato
      (err, data) => {
        if (!err) {
          console.log("Query 16", data);
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

// query 17
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
     let db = client.db(DBNAME);
     let collection = db.collection("unicorns");
     collection.updateOne(
      {"name":"Aurora"},
      {"$addToSet":{"loves":"carrot"}, "$inc":{"weight":10}},
       (err, data) => {
         if (!err) {
           console.log("Query 17", data);
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

 */
//Incrementare di 1 il numero di vampiri uccisi dall’unicorno Pluto. Se il record non esiste crearlo
//usiamo upsert crea il record se non esiste Minnie
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.updateOne({name:"Minnie"},{$inc:{vampires:1}},{upsert:true},
      (err, data) => {
        if (!err) {
          console.log("Query ", data);
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

/* */
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.updateMany({vaccinated:{$exists:false}},{$set:{vaccianted:true}},
      (err, data) => {
        if (!err) {
          console.log("Query 16", data);
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

/** */
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.deleteMany({loves:{$all:["grapes","carrot"]}},
      (err, data) => {
        if (!err) {
          console.log("Query 16", data);
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

/**o metto il .project in coda*/
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({gender:"f"},{projection:{vampires:1,name:1}}).sort({vampires:-1}).limit(1).toArray(
      (err, data) => {
        if (!err) {
          console.log("Query 16ais", data);
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


/** REPLACE*/
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.replaceOne( {name:"Pluto"},{"name":"Pluto","residenza":"fusan",piedi:4,negri:true},
      (err, data) => {
        if (!err) {
          console.log("Query 16ais", data);
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



