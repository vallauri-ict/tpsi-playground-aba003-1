let modulo=require("modulo.js");
modulo(); //richiama la funzione anonima 
let ris1=modulo.somma(3,7);
let ris2=modulo.moltiplicazione(3,4);
console.log(`Risultato somma ris1: ${ris1} \nRisultato moltiplicazione ris2: ${ris2}`);
console.log(ris1,ris2);
console.log(modulo.json.nome);
modulo.json.setNome("Negri");
console.log(modulo.json.nome);
console.log(modulo.MyClass.nome);
