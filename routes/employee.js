const express = require("express");
const employeeRoute = express();

employeeRoute.get("/", (req, res) => {
  res.json("employee routes");
});

module.exports = employeeRoute;
