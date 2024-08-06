const User = require("../../models/user");

const getUsers = async (req, res) => {
  try {
    const { branch, role } = req.query;

    // Create filter object based on query parameters
    const filter = {};
    if (branch) filter.branch = branch;
    if (role) filter.role = role;

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
