const { write } = require("fs");
let _http = require("http"); /*per linkare una libreria si usa require che è nodejs non js */
let _url = require("url"); /**libreria http e url e salviamo il puntatore alla libreria */
const { receiveMessageOnPort } = require("worker_threads");
let HEADERS = require("./headers.json"); /**nella cartella corrente prendi il file lo leggi e lo carichi nella variabile */
let _colors= require("colors");

let port = 1337; /**porta di nodeJS */

_http.createServer(function (req, res) {  /**si crea un webserver grazie alla libreria http e mi faccio restituire il puntatore */
                                                     /**questa call back viene eseguita in corrispondenza di ogni richiesta e vengono iniettati 2 parametri request e respons */
	//scrittura intestazione
	//res.writeHead(200, HEADERS.text)
    //corpo della rrisposta
    //res.write("Richiesta eseguita corretamente");  
    //res.end();
    //console.log("richiesta eseguita");

    //lettura di metodo risorsa e parametri
    let metodo=req.method; //get post o put patch
    //parsing della url ricevuta così che possiamo addere ai singoli campi
    let url= _url.parse(req.url,true); /**url corrente e true per parsificare i parametri, chiediamo alla libreria di parsificare  */
    let risorsa=url.pathname.toUpperCase();
    let parametri=url.query;
    let dominio=req.headers.host;
    let search= url.search;

    //abbiamo acceduto al metodo alla risorsa e ai parametri ora costuiamo un html che ritorniamo al client
	res.writeHead(200,HEADERS.html);
    res.write("<h1>informazioni relative alla richiesta ricevuta:</h1>");
    res.write("<br>");
    res.write(`<p><b>Metodo: </b> ${metodo} </p>`);
    res.write("<br>");
    res.write(`<p><b>Risorsa richiesta: </b> ${risorsa} </p>`);
    res.write("<br>");
    res.write(`<p><b>Parametri: </b> ${JSON.stringify(parametri)} </p>`); //abbiamo messo true e quindi i parametri sono un json e devo riserializzarlo funziona anche se non si serializza
    res.write("<br>");
    res.write(`<p><b>Dominio richiesto: </b> ${dominio} </p>`);
    res.write("<br>");
    res.write(`<p><b>ricerca richiesto: </b> ${search} </p>`);
    res.write(`<p><b>Grazie per la richiesta </b> </p>`);
    res.end();
    console.log("richiesta richevuta:" + req.url.red);

}).listen(port);

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
 //avvia il server
console.log("server in ascolto sulla porta " + port);