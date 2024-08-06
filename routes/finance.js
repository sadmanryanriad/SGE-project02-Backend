const express = require("express");
const financeRoute = express();

financeRoute.get("/", (req, res) => {
  res.json("financeRoute routes");
});

module.exports = financeRoute;
