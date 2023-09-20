const express = require("express");
const app = express();

// Ruta raíz que responde con "Hola mundo" en un método GET
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// Ruta "/mensaje" que responde con el mensaje específico en un método GET
app.get("/mensaje", (req, res) => {
  res.send("este es mi servidor usando express");
});

module.exports = app;
