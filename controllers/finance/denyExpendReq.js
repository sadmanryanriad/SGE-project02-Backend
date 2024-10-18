const User = require("../../models/user");

const denyExpendReq = async (req, res) => {
  try {
    // Get the amount from the request body and the user ID from the request parameters
    const { id } = req.params; // Get the user ID from the URL parameters

    
    // Find the user by ID
    const user = await User.findById(id); // Use findById to search by ID


    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Clear the request budget and note
    user.budget.requestBudget = 0; // or null, depending on your design
    user.budget.requestNote = ""; // Clear the note

    // Save the updated user data
    await user.save();

    // Send a success response
    return res.status(200).json({
      message: "Budget expension request denied successfully.",
      user,
    });
  } catch (error) {
    console.error("Error denied expense request:", error);
    // Use error.message or fallback to 'Server error'
    return res.status(500).json({ message: error.message || "Server error." });
  }
};

module.exports = denyExpendReq;
