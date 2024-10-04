const express = require("express");
const changeExpenseStatus = require("../controllers/finance/changeExpenseStatus");
const updateBudget = require("../controllers/finance/updateBudget");
const getUsers = require("../controllers/ceo/getUsers");
const financeRoute = express();

financeRoute.get("/", (req, res) => {
  res.json("financeRoute routes");
});

//change expense status
financeRoute.patch("/changeExpenseStatus/:id", changeExpenseStatus);
financeRoute.get("/getUsers", getUsers);
financeRoute.patch("/updateBudget/:id", updateBudget);

module.exports = financeRoute;
