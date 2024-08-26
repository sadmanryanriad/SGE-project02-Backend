const Expense = require("../models/expense");

const getAllExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const number = parseInt(req.query.number, 10);

    // Ensure the page is at least 1 and number is a positive integer
    const validPage = isNaN(page) || page < 1 ? 0 : page - 1; // Adjusting for 0-based index
    const validNumber = isNaN(number) || number < 1 ? 10 : number;

    // Find expenses and pagination
    const [allExpense, totalExpensesCount] = await Promise.all([
      Expense.find()
        .sort({ date: -1 }) // Sort by date in descending order
        .skip(validPage * validNumber)
        .limit(validNumber),
      Expense.countDocuments({}),
    ]);

    if (allExpense.length === 0) {
      return res.status(404).json({ message: "No expenses found!" });
    }

    res.status(200).json({
      message: "Expenses retrieved successfully",
      totalExpensesCount,
      totalPages: Math.ceil(totalExpensesCount / validNumber),
      expenses: allExpense,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getAllExpenses;
