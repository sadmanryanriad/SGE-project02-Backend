const Expense = require("../models/expense");

const getExpensesByBranch = async (req, res) => {
  const { branch } = req.body;

  try {
    // Validate branch format
    if (!branch) {
      return res.status(400).json({ error: "Branch is required" });
    }

    // Optional: Additional validation for branch name if needed

    const expenses = await Expense.find({ branch });

    if (expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for this branch" });
    }

    res
      .status(200)
      .json({ message: "Expenses retrieved successfully", data: expenses });
  } catch (error) {
    console.error("Error fetching expenses by branch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getExpensesByBranch;
