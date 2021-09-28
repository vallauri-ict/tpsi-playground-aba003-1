import *  as _http from 'http';
import *  as _url from 'url';
import *  as _fs from 'fs';
import *  as _mime from 'mime';
import { throws } from 'assert/strict';


let HEADERS = require("headers.json"); //require perchè non è typescript e essendo di piccole dimensioni va bene
let paginaErrore: string;

class Dispatcher {  //sintassi classi Es6
    prompt: string = ">>>"
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
}

