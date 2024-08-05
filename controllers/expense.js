const Expense = require("../models/expense");

const createExpense = async (req, res) => {
  const expenseData = req.body;

  try {
    // Validate the input data before saving
    if (
      !expenseData.expenseTitle ||
      !expenseData.amount ||
      !expenseData.branch
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //user email who requested
    expenseData.email = req.user.email;

    const newExpense = new Expense(expenseData);
    const savedExpense = await newExpense.save();
    // console.log("Expense saved:", savedExpense);

    res
      .status(201)
      .json({ message: "Expense created successfully", data: savedExpense });
  } catch (error) {
    console.error("Error creating expense:", error);

    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      return res.status(400).json({ error: errors.join(", ") });
    } else if (error.code === 11000) {
      return res.status(409).json({ error: "Duplicate field value error" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = createExpense;
