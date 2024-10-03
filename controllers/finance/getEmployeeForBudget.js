const Budget = require("../../models//budget");

const getEmployeeForBudget = async (req, res) => {
  try {
    const branch = req.params.branch;

    const result = await Budget.find({branch});

    // If no users are found
    if (result.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Retrieved successfully",
      totalUser: result.length,
      users: result,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "There was an internal error" });
  }
};

module.exports = getEmployeeForBudget;
