"use strict"

import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";


//adotteremo l'approccio con le promise(come per ajax)
//nel caso in cui dovessimo aprire due promise annidate dovremmo andare a aprire il secondo client nella then
//della prima req e chiuderlo sempre li dentro

//query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
  
    //dopo aver fatto i gruppi con $group, il recordset risultante avrà solo due colonne
    //ovvero _id e totale, tutti gli altri campi non saranno più visibili
    //NOTA: i nomi dei campi se sono a DESTRA dei due punti devono essere virgolettati
    //se sono a SINISTRA non è necessario che le abbiano
    let req = collection.aggregate([
      {$match:{status: 'A'}},
      {$group:{_id: "$cust_id", totale: {$sum : "$amount"}}},
      {$sort : {totale: -1}}
    ]).toArray();
    req.then(function(data){
      console.log("Query 1: ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

//query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    let req = collection.aggregate([
      //questa query ragguppa i dati per cust_id in una tabella con 3 colonne
      {$group:{_id: "$cust_id", avgAmount: {$avg : "$amount"}, avgTotal : {$avg: {$multiply : ["$qta" ,"$amount"]}}}}
    ]).toArray();
    req.then(function(data){
      console.log("Query 2: ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

//query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([{$match:{gender:{$exists:true}}}, //prendiamo  
      //per ogni record del gruppo aggiungi 1 
      {$group:{_id:"$gender","totale":{"$sum":1} }} //id indica il campo su cui fare i gruppi
    ]).toArray();
    req.then(function(data){
      console.log("Query 3: ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});


//query 3bis
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([{$group:{"_id":{"gender":"$gender"},mediaVampiri:{"$avg":"$vampires"}}} //prendiamo  
     
    ]).toArray();
    req.then(function(data){
      console.log("Query 3: ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

//query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([{$group:{"_id":{"gender":"$gender"},mediaVampiri:{"$avg":"$vampires"}}} //prendiamo  
     
    ]).toArray();
    req.then(function(data){
      console.log("Query 3: ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});