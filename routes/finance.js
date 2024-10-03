const express = require("express");
const changeExpenseStatus = require("../controllers/finance/changeExpenseStatus");
const getEmployeeForBudget = require("../controllers/finance/getEmployeeForBudget");
const financeRoute = express();

financeRoute.get("/", (req, res) => {
  res.json("financeRoute routes");
});

//change expense status
financeRoute.patch("/changeExpenseStatus/:id", changeExpenseStatus);
financeRoute.get("/budgets", getEmployeeForBudget);

module.exports = financeRoute;
