const User = require("../../models/user");

const getUsers = async (req, res) => {
  try {
    const { branch, additional, role, email, action } = req.query;

    const filter = {};

    // Filter by email
    if (email) {
      filter.email = email;
    }

    // Handle multiple branches
    if (branch) filter.branch = branch;
    if (additional) {
      if (filter.branch) {
        filter.branch = { $in: [filter.branch, additional] };
      } else {
        filter.branch = additional;
      }
    }

    // Handle multiple roles (e.g., employee, admin)
    if (role) {
      const roleArray = role.split(","); // Assuming role can be "employee,admin"
      filter.role = { $in: roleArray };
    }

    // If action is "request", filter users with requestBudget and requestNote
    if (action === "request") {
      filter["budget.requestBudget"] = { $exists: true };
      filter["budget.requestNote"] = { $exists: true };
    }

    // Fetch the users based on the filter
    const result = await User.find(filter);

    // If no users are found
    if (result.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    
    const reversedResult = result.reverse();

    // Return the result
    res.status(200).json({
      message: "Retrieved successfully",
      totalUser: reversedResult.length,
      users: reversedResult,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "There was an internal error" });
  }
};

module.exports = getUsers;
