const express = require("express");
const changeExpenseStatus = require("../controllers/finance/changeExpenseStatus");
const financeRoute = express();

financeRoute.get("/", (req, res) => {
  res.json("financeRoute routes");
});

//change expense status
financeRoute.patch("/changeExpenseStatus/:id", changeExpenseStatus);

module.exports = financeRoute;
