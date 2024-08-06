const express = require("express");
const ceoRoute = express();

ceoRoute.get("/", (req, res) => {
  res.json("ceoRoute routes");
});

module.exports = ceoRoute;
