const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already exists"],
  },
  role: {
    type: String,
    required: true,
  },
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
  allocationDate: {
    type: Date,
    default: Date.now, 
  },
  dueDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
