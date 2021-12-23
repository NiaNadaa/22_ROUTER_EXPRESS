const express = require("express");
const router = express.Router();

router.post("/checkin", (req, res) => {
  req.app.locals.db.collection("clientes").find({ dni: req.body.dni }).toArray((err, data) => {
    if (err) {
      res.send({
        error: err,
        message: "Consulta a la base de datos fallida",
      });
    } else {
      if (data.length == 0) {
        res.send({
          data: data,
          message: "Usuario con el DNI introducido no encontrado",
        });
      } else {
        req.app.locals.db.collection("habitaciones").find({ num: req.body.num }).toArray((err1, data1) => {
            if (err) {
              res.send({
                error: err1,
                message: "Consulta a la base de datos fallida",
              });
            } else {
              if (!data1[0].libre) {
                res.send({
                  data: data1,
                  message: `${req.body.num} esta ocupada`,
                });
              } else {
                req.app.locals.db.collection("reservas").insertOne(
                  {
                    cliente: req.body.dni,
                    habitacion: req.body.num,
                    checkin: req.body.checkin,
                    checkout: "",
                    activa: true,
                  },
                  (err2, data2) => {
                    if (err2) {
                      res.send({
                        error: err2,
                        message: "Consulta a la base de datos fallida",
                      });
                    } else {
                      if (data2.insertedId == undefined) {
                        res.send({
                          data: data2,
                          message:"Reserva fallida",
                        });
                      } else {
                        req.app.locals.db.collection("habitaciones").updateOne({ num: req.body.num },
                        { $set: { libre: false } },
                          (err3, data3) => {
                            if (err3) {
                              res.send({
                                error: err3,
                                message:
                                  "Consulta a la base de datos fallida",
                              });
                            } else {
                              if (data3.modifiedCount == 0) {
                                res.send({
                                  data: data3,
                                  message: 'Error al cambiar el estado de la habitacion',
                                });
                              } else {
                                res.send({
                                  data: data3,
                                });
                              }
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }
          });
        }
      }
    });
});

router.put("/checkout", (req, res) => {
  req.app.locals.db.collection("clientes").find({ dni: req.body.dni })
    .toArray((err, data) => {
      if (err) {
        res.send({
          error: err,
          message: "Consulta a la base de datos fallida",
        });
      } else {
        if (data.length == 0) {
          res.send({
            data: data,
            message: "No se ha encontrado ese cliente alojado",
          });
        } else {
          req.app.locals.db.collection("reservas").updateOne(
            { $and: [{ cliente: req.body.dni }, { activa: true }] },
            { $set: { checkout: req.body.checkout, activa: false } },
            (err1, data1) => {
              if (err1) {
                res.send({
                  error: err1,
                  message: "Consulta a la base de datos fallida",
                });
              } else {
                if (data1.modifiedCount == 0) {
                  res.send({
                    data: data1,
                    message: "Checkout fallido",
                  });
                } else {
                  req.app.locals.db.collection("habitaciones").updateOne(
                    { num: req.body.num },
                    { $set: { libre: true } },
                    (err2, data2) => {
                      if (err2) {
                        res.send({
                          error: err2,
                          message:"Consulta a la base de datos fallida",
                        });
                      } else {
                        if (data2.modifiedCount == 0) {
                          res.send({
                            data: data2,
                            message:"Error cambiando el estado de la habitacion",
                          });
                        } else {
                          res.send({
                            data: data2
                          });
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    });
});

module.exports = router;
