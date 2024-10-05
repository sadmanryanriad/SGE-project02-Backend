const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    unique: [true, "Email already exists"],
    match: [/.+\@.+\..+/, "Email is not valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["employee", "finance", "ceo", "hr", "admin"],
    required: [true, "Role is required"],
  },
  branch: {
    type: String,
    required: [true, "Branch is required"],
  },
  firebaseUid: {
    type: String,
  },
  budget: {
    givenBudget: {
      type: Number,
      default: 0,
    },
    remainingBudget: {
      type: Number,
      default: 0,
    },
    requestBudget: {
      type: Number,
      default: 0,
    },
    requestNote: {
      type: String,
      maxlength: [400, "Request note must be less than 400 letter"],
    },
    allocationDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
