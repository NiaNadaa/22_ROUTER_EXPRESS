const express = require("express");
const router = express.Router();

router.post("/crear", (req, res) => {
  req.app.locals.db.collection("clientes").find({ dni: req.body.dni })
  .toArray(function (err, data) {
      if (err) {
        res.send({
          error: err,
          message: "No ha sido posible conectarse a la base de datos",
        });
      } else {
        if (data.length > 0) {
          res.send({
            result: data,
            message: "Ya existe un usuario con ese DNI",
          });
        } else {
          req.app.locals.db.collection("clientes")
          .insertOne(req.body, function (err1, data2) {
            if(err1){
              res.send({ error: err })
            }else{
              res.send({ result: data2 })
            }
          });
        }
      }
    });
});

router.put("/modificar", (req, res) => {
  req.app.locals.db.collection("clientes").updateOne({ dni: req.body.dni }, { $set: req.body }, (err, data) => {
      if (err) {
        res.send({
          error: err
        });
      } else {
        if (data.modifiedCount > 0) {
          res.send({
            result: data
          });
        } else {
          res.send({
            message: "Cliente no actualizado",
            result: data
          });
        }
      }
    });
});

module.exports = router;
