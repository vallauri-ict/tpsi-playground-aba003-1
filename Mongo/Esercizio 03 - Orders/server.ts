"use strict";

import * as _http from "http";
import { Dispatcher } from "./dispatcher";
import HEADERS from "./headers.json";
import * as _mongodb from "mongodb";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

/*
//query 1
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("orders");
      let req = collection.aggregate([{$match:{status:"A"}},{$group:{_id:"$cust_id" , amount:{$sum:"$amount"}}},{$sort:{amount:-1}}]).toArray();
      req.then(function(data){
          console.log("Query 1",data);
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

//query 2
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("orders");
      let req = collection.aggregate([{$group:{_id:"$cust_id",avgAmount:{$avg:"$amount"},avgTotale:{$avg:{$multiply:["$qta","$amount"]}}}}]).toArray();
      req.then(function(data){
          console.log("Query 2",data);
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

//query 3
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([{$match:{"gender":{"$exists":true}}},{$group:{_id:"$gender",number:{$sum:1}}}]).toArray();
      req.then(function(data){
          console.log("Query 3",data);
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

//query 4
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([{$match:{"gender":{"$exists":true}}},{$group:{_id:"$gender",uccisioni:{$avg:"$vampires"}}}]).toArray();
      req.then(function(data){
          console.log("Query 4",data);
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

//query 5
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([{$match:{"gender":{"$exists":true}}},{$group:{_id:{gender:"$gender",hair:"$hair"},uccisioni:{$avg:"$vampires"}}},{$sort:{uccisioni:1}}]).toArray();
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


//query 6
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
    //creazione di un campo fittizio
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([{$group:{_id:{},averegaKills:{$avg:"$vampires"}}},{$sort:{averageKills:1}}]).toArray();
      req.then(function(data){
          console.log("Query 6",data);
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

//query 7
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
    //creazione di un campo fittizio
      let db = client.db(DB_NAME);
      let collection = db.collection("quizzes");
      let req = collection.aggregate([ //funzione di aggrezazione sui project

        {$project:{
          mediaQuiz:{$avg:"$quizzes"},
          mediaLabs:{$avg:"$labs"},
          mediaExam:{$avg:["$final","$midterm"]}
        }},{
          $project:{
            mediaQuizApp:{$round:["$mediaQuiz",1]},
            mediaLabsApp:{$round:["$mediaLabs",1]},
            mediaExamApp:{$round:["$mediaExam",1]}
          }
        },{$group:{
          _id:{},mediaQuizTot:{$avg:"$mediaQuizApp"},
          mediaLabsTot:{$avg:"$mediaLabsApp"},
          mediaExamTot:{$avg:"$mediaExamApp"},
      
      }},{$project:{
        mediaQuizApp:{$round:["$mediaQuizTot",1]},
        mediaLabsApp:{$round:["$mediaLabsTot",1]},
        mediaExamApp:{$round:["$mediaExamTot",1]}
      }}





      ]).toArray();
      req.then(function(data){
          console.log("Query 7",data);
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

//query 9
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
    //creazione di un campo fittizio
      let db = client.db(DB_NAME);
      let collection = db.collection("orders");
      let req = collection.aggregate([ //funzione di aggrezazione sui project
       {$match:{genere:"f"}},{$project:{nome:1,classe:1,media:{$avg:"$voti"}}},{$sort:{media:-1}},{$skip:1},{$limit:1}
      ]).toArray();
      req.then(function(data){
          console.log("Query 9",data);
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

//query 8
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err){
    //creazione di un campo fittizio
      let db = client.db(DB_NAME);
      let collection = db.collection("students");
      let req = collection.aggregate([ //funzione di aggrezazione sui project
       {$match:{genere:"f"}},{$project:{nome:1,classe:1,media:{$avg:"$voti"}}},{$sort:{media:-1}},{$skip:1},{$limit:1}
      ]).toArray();
      req.then(function(data){
          console.log("Query 8",data);
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
// Query 9:
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db(DB_NAME);
        let collection = db.collection("orders");
        let req = collection.aggregate([
            {"$project":{"status":1,"nDettagli":1}},
            {"$unwind":"$nDettagli"},
            {"$group":{"_id":"$status","sommaDettagli":{"$sum":"$nDettagli"}}}
        ]).toArray();
        req.then(function(data){
            console.log("Query 9",data);
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

// Query 10:
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db(DB_NAME);
        let collection = db.collection("students");
        let req = collection.find(
            {"$expr":{"$gte":[{"$year":"$nato"},2000]}}
        ).toArray();
        req.then(function(data){
            console.log("Query 10",data);
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



//query  11
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
      //creazione di un campo fittizio
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        let req = collection.aggregate([ //funzione di aggrezazione sui project
                {$match:{gender:{$exists:true}}}
            ,{$group:{_id:"$gender", AvgWeight:{$avg:"$weight"}}}
        ]).toArray();
        req.then(function(data){
            console.log("Query 11",data);
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

  //query  12
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
      //creazione di un campo fittizio
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        let req = collection.aggregate([ //funzione di aggrezazione sui project
                {$match:{loves:{$in:["apple"]}}} ,{$group:{_id:"$gender",uccisioni:{$avg:"$vampires"}}},
                {$project:{ uccisioni:{$round:["$uccisioni",1]}}}
                ,{$group:{_id:{},mediaKill:{$avg:"$uccisioni"}}}
           
        ]).toArray();
        req.then(function(data){
            console.log("Query 12",data);
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

  //qury 13 DA fare
  mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
      //creazione di un campo fittizio
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        let req = collection.aggregate([ //funzione di aggrezazione sui project
            {$project:{
                frutti:{loves:{$sum:1}},
                
              }},
        ]).toArray();
        req.then(function(data){
            console.log("Query 13",data);
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

    //qury 14
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
        if(!err){
          //creazione di un campo fittizio
            let db = client.db(DB_NAME);
            let collection = db.collection("students");
            let req = collection.aggregate([ //funzione di aggrezazione sui project
               {$project:{classe:1,media:{$avg:"$voti"}}},{$group:{_id:"$classe",mediaClasse:{$avg:"$media"}}},{$match:{mediaClasse:{$gte:6}}}
            ]).toArray();
            req.then(function(data){
                console.log("Query 14",data);
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

        //qury 15 da fare
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
        if(!err){
          //creazione di un campo fittizio
            let db = client.db(DB_NAME);
            let collection = db.collection("students");
            let req = collection.aggregate([ //funzione di aggrezazione sui project
              {$match:{nato:{$gte:2000}}}
            ]).toArray();
            req.then(function(data){
                console.log("Query 15",data);
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