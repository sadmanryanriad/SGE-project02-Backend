const Expense = require("../models/expense");

const getUsersWithTotalExpenses = async (req, res) => {
  try {
    const { branch, role } = req.query;

    const matchStage = {};
    if (branch) {
      matchStage.branch = branch;
    }
    if (role) {
      matchStage.role = role;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$email",
          totalAmount: { $sum: "$amount" },
          username: { $first: "$username" },
          role: { $first: "$role" },
          branch: { $first: "$branch" },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          totalAmount: 1,
          username: 1,
          role: 1,
          branch: 1,
        },
      },
    ];

    const result = await Expense.aggregate(pipeline);

    res.status(200).json({
      message: "Retrieved successfully",
      totalUser: result.length,
      result,
    });
  } catch (error) {
    console.error("Error fetching users with total expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUsersWithTotalExpenses;
