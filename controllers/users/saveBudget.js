const BudgetSchema = require("../../models/budget");

const saveBudget = async (budgetData) => {
  try {
    const existingBudget = await BudgetSchema.findOne({ email: budgetData.email });
    if (existingBudget) {
      throw new Error("Budget entry with this email already exists");
    }

    const newBudget = new BudgetSchema(budgetData);
    const savedBudget = await newBudget.save();
    return savedBudget;
  } catch (error) {
    console.error("Error saving budget:", error);
    if (error.code === 11000) {
      throw new Error("Email already exists");
    } else if (error.message === "Budget entry with this email already exists") {
      throw new Error("Budget entry with this email already exists");
    } else if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      throw new Error(errors.join(", "));
    } else {
      throw new Error(error.message);
    }
  }
};



module.exports = saveBudget;
