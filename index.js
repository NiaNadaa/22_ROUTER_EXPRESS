const express = require("express");
const app = express();
const mongodb = require("mongodb");

app.listen(process.env.PORT || 3000);
console.log('Servidor corriendo en puerto: 3000');

const MongoClient = mongodb.MongoClient;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if(err){
    console.log("Conexion a base de datos fallida")
  }else{
    app.locals.db = client.db("hotel")
    console.log("Conectado a la base de datos con exito");
  }
});

let clientes = require("./clientes");
let reservas = require("./reservas");
app.use("/clientes", clientes);
app.use("/reservas", reservas);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
