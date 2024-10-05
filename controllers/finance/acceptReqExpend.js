const User = require("../../models/user");

const acceptReqExpend = async (req, res) => {
  try {
    // Get the amount from the request body and the user ID from the request parameters
    const { amount } = req.body;
    const { id } = req.params; // Get the user ID from the URL parameters

    // Validate the amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required." });
    }

    // Find the user by ID
    const user = await User.findById(id); // Use findById to search by ID

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure the amount is a number
    const requestAmount = parseFloat(amount);

    // Merge the requested amount with the remaining budget
    user.budget.remainingBudget += requestAmount;
    user.budget.givenBudget += requestAmount;

    // Clear the request budget and note
    user.budget.requestBudget = 0; // or null, depending on your design
    user.budget.requestNote = ""; // Clear the note

    // Save the updated user data
    await user.save();

    // Send a success response
    return res.status(200).json({
      message: "Budget expension request accepted successfully.",
      user,
    });
  } catch (error) {
    console.error("Error accepting expense request:", error);
    // Use error.message or fallback to 'Server error'
    return res.status(500).json({ message: error.message || "Server error." });
  }
};

module.exports = acceptReqExpend;
