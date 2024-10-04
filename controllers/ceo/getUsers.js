const User = require("../../models/user");

const getUsers = async (req, res) => {
  try {
    const { branch, additional, role,email } = req.query;

    const filter = {};

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
      const roleArray = role.split(",");  // Assume role can be "employee,admin"
      filter.role = { $in: roleArray };
    }

    const result = await User.find(filter);

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

module.exports = getUsers;
