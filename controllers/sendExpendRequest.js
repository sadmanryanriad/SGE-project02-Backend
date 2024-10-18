const User = require("../models/user");

const sendExpendRequest = async (req, res) => {
  try {
    // Get data from frontend request
    const { email, requestBudget, requestNote } = req.body;

    // Validate input
    if (!email || !requestBudget || !requestNote) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure budget field exists
    if (!user.budget) {
      user.budget = {};
    }

    if (!user.budget.dueDate) {
      return res.status(403).json({
        message:
          "You are not eligible to submit a budget expand request, untill Budget allocation.",
      });
    }

    if (user.budget.requestBudget && user.budget.requestNote) {
      return res.status(400).json({
        message:
          "You have already submitted an budegt expand request. Please wait for the finance team to respond before submitting a new expand request.",
      });
    }

    // Update the request budget and note
    user.budget.requestBudget = requestBudget;
    user.budget.requestNote = requestNote;

    // Save the updated user data
    await user.save();

    // Send a success response
    return res
      .status(200)
      .json({ message: "Expend request sent successfully.Wait for the finace response", user });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = sendExpendRequest;
