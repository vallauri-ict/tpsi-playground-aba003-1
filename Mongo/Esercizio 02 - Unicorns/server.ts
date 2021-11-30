"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
import * as _mongodb from "mongodb"
import { HEADERS } from "./headers";


const mongoClient = _mongodb.MongoClient;

const CONNECTIONSTRING = "mongodb+srv://edoardo:aba@cluster0.7z0jw.mongodb.net/5B?retryWrites=true&w=majority"; //accesso su atlas
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"; locale
const DBNAME = "5B";
/*const dispatcher = new Dispatcher();
const PORT = 1337; //

const server = _http.createServer(function (req, res) { 
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);*/


// query 1 
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

// query 2
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({ $and:[{gender:"m"},{loves:"grape"},{vampires:{$gte:60}}] }).toArray((err, data) => {
      if (!err) {
        console.log("Query 2 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})

// query 3
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({ $or:[{gender:"f"},{weight:{$gte:700}}] }).toArray((err, data) => {
      if (!err) {
        console.log("Query 3 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})

// query 4
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({ $and:[{loves:{$in:["grape","apple"]}},{weight:{$lte:700}}] }).toArray((err, data) => {
      if (!err) {
        console.log("Query 4 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})

// query 5
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({ $and:[{loves:["grape","watermelon"]},{vampires:{$gte:60}}] }).toArray((err, data) => {
      if (!err) {
        console.log("Query 5 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})

// query 6
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({hair:{$in:["grey","brown"]} }).toArray((err, data) => {
      if (!err) {
        console.log("Query 6 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})


// query 7
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({vaccinated:{$exists:true} }).toArray((err, data) => {
      if (!err) {
        console.log("Query 7 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})

// query 8
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.updateMany({vaccinated:{$exists:false}},{$set:{vaccianted:true}},
      (err, data) => {
        if (!err) {
          console.log("Query 8", data);
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

// query 9
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let regex = new RegExp("^a","i")
    collection.find({$and:[{name:{$regex:regex}},{gender:"f"}] }).toArray((err, data) => {
      if (!err) {
        console.log("Query 9 - ", "N record: " + data.length, data);
      } else {
        console.log("Errore esecuzione query " + err.message);
      }
      client.close();
    })
  } else {
    console.log("Errore connessione al db");
  }
})

// query 10
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ _id: new _mongodb.ObjectId("6182393d6b386f16673b9e81") }) 
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

// query 11
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ gender:"m" }).project({name:1,vampires:1,_id:0}) 
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

// query 11b
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ gender:"m" }).project({name:1,vampires:1,_id:0}).sort({vampires:1}) 
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

// query 11c
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection
      .find({ gender:"m" }).project({name:1,vampires:1,_id:0}).sort({vampires:1}).limit(3) 
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 11c - ", "N record: " + data.length, data);
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
    collection
      .find({ weight:{$gte:500}}).count( 
      function (err, data) {
        if (!err) {
          console.log("Query 12 - ", data);
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
    collection
    collection.findOne({ name: "Aurora" }, { projection: { weight: 1, hair: 1 ,_id:0,name:1} },(err, data) => {
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
    collection
    collection.distinct( "loves",(err, data) => { //il campo su cui vogliamo fare il distinct
        if (!err) {
          console.log("Query 14 ", data);
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

// query 15
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.updateOne(
      { name: "Aurora" }, {$addToSet:{loves:"Apple"}, $inc: { vampires: 1 } }, (err, data) => { 
        if (!err) {
          console.log("Query 15", data);
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
      { name: "Bellino" }, {$inc: { vampires: 1 } },{"upsert":true}, (err, data) => { 
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
    collection.deleteMany({loves:{$all:["lemon","ses"]}}, (err, data) => { 
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

// query 18
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({gender:"f"}).sort({vampires:-1}).project({name:1,vampires:1,_id:0}).limit(1).toArray( (err, data) => { 
        if (!err) {
          console.log("Query 18", data);
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

// query 19
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({gender:"f"}).sort({vampires:-1}).project({name:1,vampires:1,_id:0}).limit(1).toArray( (err, data) => { 
        if (!err) {
          console.log("Query 19", data);
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

// query 20
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.replaceOne({name:"Horny"},{"name":"Pluto","residenza":"fusan"}, (err, data) => { 
        if (!err) {
          console.log("Query 20", data);
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

// query 21
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.find({$and:[{gender:"m"},{loves:{"apple":{$exists:true}}}]}).toArray( (err, data) => { 
        if (!err) {
          console.log("Query 20", data);
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








