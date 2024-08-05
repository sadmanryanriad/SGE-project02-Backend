const Expense = require("../models/expense");

const getExpensesByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Validate email format
    if (!/.+\@.+\..+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Only the user itself or roles 'finance', 'ceo', or 'admin' can access
    if (
      req.user.email !== email &&
      req.user.role !== "finance" &&
      req.user.role !== "ceo" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const expenses = await Expense.find({ email });

    if (expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for this email" });
    }

    res
      .status(200)
      .json({ message: "Expenses retrieved successfully", data: expenses });
  } catch (error) {
    console.error("Error fetching expenses by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getExpensesByEmail;
