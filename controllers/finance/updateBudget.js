const User = require("../../models/user");

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params; // Get the budget ID from the route params
    const { givenAmount } = req.body; // Assuming the new budget amount is provided in the request body

    // Find the budget by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the given amount
    user.budget.givenBudget = givenAmount;
    user.budget.remainingBudget = givenAmount;

    // Update allocation date to the current date
    user.budget.allocationDate = new Date();

    // Set due date to the same day next month
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    user.budget.dueDate = nextMonth;

    // Save the updated budget
    await user.save();

    res.status(200).json({
      message: "Employee budget updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateBudget;
