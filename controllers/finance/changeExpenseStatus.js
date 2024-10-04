const { isValidObjectId } = require("mongoose");
const Expense = require("../../models/expense");
const User = require("../../models/user"); // Assuming User model is available

const changeExpenseStatus = async (req, res) => {
  try {
    const { status: newStatus } = req.body;
    const expenseId = req.params.id;

    // Validate newStatus
    if (newStatus !== "granted" && newStatus !== "rejected") {
      return res.status(400).json({ message: "Need a valid status" });
    }

    // Ensure expenseId is valid
    if (!isValidObjectId(expenseId)) {
      return res.status(400).json({ message: "Valid Expense ID is required" });
    }

    // Find the expense
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Find the user associated with the expense
    const user = await User.findOne({ email: expense.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If the new status is "granted," check and reduce the user's remaining budget
    if (newStatus === "granted") {
      if (user.budget.remainingBudget >= expense.amount) {
        user.budget.remainingBudget -= expense.amount; // Reduce the budget
        await user.save(); // Save the updated user with new budget
      } else {
        return res.status(400).json({ message: "Insufficient budget" });
      }
    }

    // Update the expense status
    const filter = { _id: expenseId };
    const update = { status: newStatus };
    const result = await Expense.findOneAndUpdate(filter, update, {
      new: true,
    });

    res.status(200).json({
      message: "Expense status updated successfully",
      updatedExpense: result,
    });
  } catch (error) {
    console.error("Error updating expense status:", error);
    res.status(500).json({ message: "There was an internal error" });
  }
};

module.exports = changeExpenseStatus;
