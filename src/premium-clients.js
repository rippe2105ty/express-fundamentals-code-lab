const express = require("express");
const router = express.Router();

function setHeader(req, res, next) {
  res.header("url", req.originalUrl);
  next();
}

router.use(setHeader);

router.get("/", function (req, res) {
  res.send("Ruta clientes premium");
});

module.exports = router;