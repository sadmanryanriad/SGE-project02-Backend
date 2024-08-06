const express = require("express");
const getUsers = require("../controllers/ceo/getUsers");
const ceoRoute = express();

ceoRoute.get("/", (req, res) => {
  res.json("ceoRoute routes");
});

//get finances by branch
ceoRoute.get("/getUsers", getUsers);

module.exports = ceoRoute;
