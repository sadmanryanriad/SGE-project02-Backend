const express = require("express");
const changeExpenseStatus = require("../controllers/finance/changeExpenseStatus");
const getEmployeeForBudget = require("../controllers/finance/getEmployeeForBudget");
const updateBudget = require("../controllers/finance/updateBudget");
const financeRoute = express();

financeRoute.get("/", (req, res) => {
  res.json("financeRoute routes");
});

//change expense status
financeRoute.patch("/changeExpenseStatus/:id", changeExpenseStatus);
financeRoute.get("/budgets", getEmployeeForBudget);
financeRoute.patch("/updateBudget/:id", updateBudget);

module.exports = financeRoute;
