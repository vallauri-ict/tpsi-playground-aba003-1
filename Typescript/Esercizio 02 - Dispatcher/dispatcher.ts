import *  as _http from 'http';
import *  as _url from 'url';
import *  as _fs from 'fs';
import *  as _mime from 'mime';
import { throws } from 'assert/strict';
import { json } from 'stream/consumers';


let HEADERS = require("./headers.json"); //require perchè non è typescript e essendo di piccole dimensioni va bene
let paginaErrore: string;

class Dispatcher {  //sintassi classi Es6
    prompt: string = ">>> "
    //any perchè è un json e va bene costituito da diverse chiai che costituiscono i metodi http
    listeners: any = {
        //ogni listener è csotituito da un json es:{risorsa:callback}  i listeners sono suddivisi in base al metodo di chiamata  
        "GET": {},
        "POST": {},
        "DELETE": {},
        "PUT": {},
        "PATCH": {}
    }
    constructor() {
        init();
    }
    //deve andare a registrare il listener dentro il vettore dei listeners
    addListener(method: string, resource: string, callBack: any) {
        method = method.toUpperCase();//mi restituisce il valore in maiuscolo
        /*if (this.listeners[method]) { }*/
        if (method in this.listeners) { //vedere se una chiave è in un json
            this.listeners[method][resource] = callBack; //crea una nuova chiave che si chiama risorsa e come valore mette una callback
        } else {
            throw new Error("metodo non valido");
        }
    }

    dispatch(req: any, res: any) {
        //ci prendiamo le caratteristiche
        let metodo = req.method;
        let url = _url.parse(req.url, true);
        let risorsa: any = url.pathname;
        let parametri = url.query;//parametri è un json
        console.log(`${this.prompt}  ${metodo}:  ${risorsa} ${JSON.stringify(parametri)}`);

        if (risorsa.startsWith("/api/")) {
            if (risorsa in this.listeners[metodo]) {
                let callback = this.listeners[metodo][risorsa];
                //lancio in esecuzione la callback
                callback(req, res);
            } else {
                //il client si aspetta un json  ma in caso di errore gli mandiamo una string
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        } else {
            staticListener(req, res, risorsa); //la usa solo il dispatcher 
        }
    }
}
function staticListener(req: any, res: any, risorsa: any) {
    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    let filename = "./static" + risorsa; //risorsa starta sempre per /
    _fs.readFile(filename, function (err, data) {
        if (!err) {
            let header = { "Content-Type": _mime.getType(filename) };
            res.writeHead(200, header);
            res.write(data);
            res.end();
        } else {
            console.log()
            //il client si aspetta una pagina
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}
function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        } else {
            paginaErrore = ("<h1>Pagina non trovata!!</h1>")
        }
    })
}
//dbbiamo esportare la classe ES5 common JS
module.exports = new Dispatcher(); //esporta solo l' iistanza

