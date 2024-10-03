const Budget = require("../../models/budget");

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params; // Get the budget ID from the route params
    const { givenAmount } = req.body; // Assuming the new budget amount is provided in the request body

    // Find the budget by ID
    const budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Update the given amount
    budget.givenBudget = givenAmount;
    budget.remainingBudget = givenAmount;

    // Update allocation date to the current date
    budget.allocationDate = new Date();

    // Set due date to the same day next month
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    budget.dueDate = nextMonth;

    // Save the updated budget
    await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateBudget;
