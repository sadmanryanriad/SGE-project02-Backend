const Expense = require("../models/expense");

const getUsersWithTotalExpenses = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: "$email",
          totalAmount: { $sum: "$amount" },
          username: { $first: "$username" },
          role: { $first: "$role" },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          totalAmount: 1,
          username: 1,
          role: 1,
        },
      },
    ]);

    res
      .status(200)
      .json({
        message: "retrieved successfully",
        totalUser: result.length,
        result,
      });
  } catch (error) {
    console.error("Error fetching users with total expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUsersWithTotalExpenses;
