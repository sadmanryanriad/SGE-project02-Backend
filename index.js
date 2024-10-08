const express = require("express");
const port = process.env.PORT || 5001;
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.yv9dii9.mongodb.net/${process.env.DB}?retryWrites=true&w=majority&appName=Cluster0`;
const employeeRoute = require("./routes/employee");
const signUp = require("./controllers/signUp");
const login = require("./controllers/login");
const expense = require("./controllers/expense");
const getExpensesByEmail = require("./controllers/getExpensesByEmail");
const { authUser, authorizeRole } = require("./middlewares/auth");
const getExpensesByBranch = require("./controllers/getExpensesByBranch");
const getAllExpenses = require("./controllers/getAllExpenses");
const financeRoute = require("./routes/finance");
const getRole = require("./controllers/getRole");
const ceoRoute = require("./routes/ceo");
const getUsersWithTotalExpenses = require("./controllers/getUsersWithTotalExpenses");
const createFinance = require("./controllers/finance/financeRegistration");
const decodeEmail = require("./controllers/decodeEmail");
const downloadFile = require("./controllers/downloadFile");
const getFile = require("./controllers/getFile");

//middlewares
// Allow requests from specific origin and support credentials
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://sge-project02.web.app/",
    "https://finance.studyuk.today",
    "http://finance.studyuk.today",
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection
mongoose
  .connect(uri)
  .then(() => {
    // personal routes
    app.use("/employee", employeeRoute);
    app.use("/finance", authUser, authorizeRole(["finance"]), financeRoute);
    app.use("/ceo", authUser, authorizeRole(["ceo"]), ceoRoute);

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
      authorizeRole(["finance", "ceo"]),
      getExpensesByBranch
    );
    //get all expenses (paging)
    app.get(
      "/expenses",
      authUser,
      authorizeRole(["finance", "ceo", "admin"]),
      getAllExpenses
    );
    //signup
    app.post("/signup", signUp);
    //login
    app.post("/login", login);
    //fetch role of an user
    app.get("/getRole/:email", getRole);
    // fetch users with their total expenses
    app.get(
      "/users/expenses",
      authUser,
      authorizeRole(["admin", "finance", "ceo"]),
      getUsersWithTotalExpenses
    );
    app.post(
      "/create-finance",
      authUser,
      authorizeRole(["ceo"]),
      createFinance
    );
    //download files
    app.get("/file-download/:filePath", downloadFile);
    //static files
    app.get("/file/:filePath", getFile);

    app.listen(port, () => {
      console.log(`Connected to database and listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
