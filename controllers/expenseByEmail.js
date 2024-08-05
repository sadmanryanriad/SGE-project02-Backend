const Expense = require("../models/expense");

const getExpensesByEmail = async (req, res) => {
  const { email } = req.params;
  //   console.log(`Fetching expenses for email: ${email}`);

  try {
    // Validate email format
    if (!/.+\@.+\..+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const expenses = await Expense.find({ email });
    // console.log(`Found ${expenses.length} expenses for email: ${email}`);

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
