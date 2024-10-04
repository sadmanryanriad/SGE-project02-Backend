const express = require("express");
const employeeRoute = express();
const getUsers = require("../controllers/ceo/getUsers");


employeeRoute.get("/", (req, res) => {
  res.json("employee routes");
});

employeeRoute.get("/getUsers", getUsers);

module.exports = employeeRoute;
