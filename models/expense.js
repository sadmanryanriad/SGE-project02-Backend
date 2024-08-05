const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  expenseTitle: {
    type: String,
    required: [true, "Expense Title is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Email is not valid"],
  },
  branch: {
    type: String,
    required: [true, "Branch is required"],
  },
  notes: {
    type: String,
  },
  receipt: {
    type: String,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
