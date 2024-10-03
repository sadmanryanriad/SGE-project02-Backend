const Budget = require("../../models/budget");

const getEmployeeForBudget = async (req, res) => {
  try {
    // Get branch and additionalBranch from query parameters
    const { branch, additionalBranch } = req.query;

    // Initialize filter object
    const filter = {};

    // Check if branch exists and add to filter
    if (branch) {
      filter.branch = branch;
    }

    // Check if additionalBranch exists and add to filter
    if (additionalBranch) {
      if (filter.branch) {
        filter.branch = { $in: [filter.branch, additionalBranch] };
      } else {
        filter.branch = additionalBranch; // Set to additionalBranch if branch is not set
      }
    }

    // Fetch users based on the filter
    const result = await Budget.find(filter);

    // If no users are found
    if (result.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Reverse the result
    const reversedUsers = result.reverse();

    res.status(200).json({
      message: "Retrieved successfully",
      totalUser: reversedUsers.length, // Update to count of reversed users
      users: reversedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "There was an internal error" });
  }
};

module.exports = getEmployeeForBudget;
