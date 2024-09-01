const mongoose = require("mongoose");
const { Schema } = mongoose;

const FinanceSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [3, "First name must be at least 3 characters long"],
    maxlength: [50, "First name must be at most 50 characters long"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [3, "Last name must be at least 3 characters long"],
    maxlength: [50, "Last name must be at most 50 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Email is not valid"],
  },
  role: {
    type: String,
    default: "finance", // Default role for finance users
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Finance = mongoose.model("Finance", FinanceSchema);

module.exports = Finance;
