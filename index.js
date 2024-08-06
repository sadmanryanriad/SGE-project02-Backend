const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.yv9dii9.mongodb.net/${process.env.DB}?retryWrites=true&w=majority&appName=Cluster0`;
const employeeRoute = require("./routes/employee");
const signUp = require("./controllers/signUp");
const login = require("./controllers/login");
const expense = require("./controllers/expense");
const getExpensesByEmail = require("./controllers/getExpensesByEmail");
const { authUser, authorizeRole } = require("./middlewares/auth");
const getExpensesByBranch = require("./controllers/getExpensesByBranch");
const getAllExpenses = require("./controllers/getAllExpenses");

//middlewares
// Allow requests from specific origin and support credentials
const corsOptions = {
  origin: ["http://localhost:5173", ""],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

//database connection
mongoose
  .connect(uri)
  .then(() => {
    // protected routes
    app.use("/employee", employeeRoute);

    app.get("/", async (req, res) => {
      res.status(200).json("HOME PAGE");
    });
    //create expense
    app.post("/expense", authUser, expense);
    //get expense by email
    app.get("/expense/:email", authUser, getExpensesByEmail);
    // Get expenses by branch
    app.post(
      "/expense/branch",
      authUser,
      authorizeRole(["finance", "ceo", "admin"]),
      getExpensesByBranch
    );
    //get all expenses (paging)
    app.get("/expenses", getAllExpenses);
    //signup
    app.post("/signup", signUp);
    //login
    app.post("/login", login);
    // app.get("/role/:email", getRole);

    app.listen(port, () => {
      console.log(`Connected to database and listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
