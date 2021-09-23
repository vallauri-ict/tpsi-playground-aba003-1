"use strict";



function inviaRichiesta(method, url, parameters={}) {
	let contentType;
	if(method.toUpperCase()=="GET" ) //vede se la chiamata è get manda via i param come url&coded
		contentType="application/x-www-form-urlencoded;charset=utf-8";
	else{
		contentType = "application/json; charset=utf-8" //se no li trasmetti json e li parsifica
        parameters = JSON.stringify(parameters);
	}
    return $.ajax({       
        "url": url,
		"data": parameters,
		"type": method,   
		"contentType": contentType, 
        "dataType": "json",   // come $ajax resitituisce i dati       
        "timeout": 5000,      // default 
    });	
}

function errore(jqXHR, text_status, string_error) { 
    if (jqXHR.status == 0) 
        alert("Connection Refused or Server timeout");
	else if (jqXHR.status == 200) // se gli è arrivato un json formattato male si richiama la procedura di errore prima di returnarlo al client
        alert("Formato dei dati non corretto : " + jqXHR.responseText);
	else if (jqXHR.status == 403) //credenziali non valide si fa un redirect a login.html
        window.location.href = "login.html"
    else
        alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}

function generaNumero(a, b){
	return Math.floor((b - a + 1) * Math.random()) + a;
}