const User = require("../models/user");

const getRole = async (req, res) => {
  try {
    const email = req.params.email;
    const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email
    if (!basicEmailPattern.test(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    // Fetch user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's role
    res.status(200).json({ role: user.role, branch: user.branch });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "There was an internal error" });
  }
};

module.exports = getRole;
