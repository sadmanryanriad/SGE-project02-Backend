const { isValidObjectId } = require("mongoose");
const Expense = require("../../models/expense");

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
      return res.status(400).json({ message: "valid Expense ID is required" });
    }

    const filter = { _id: expenseId };
    const update = { status: newStatus };

    const result = await Expense.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Expense not found" });
    }

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
