const UserSchema = require("../../models/user");

const saveUser = async (userData) => {
  try {
    // console.log("Creating new user instance...");
    const newUser = new UserSchema(userData);
    // console.log("Saving new user to database...");
    const savedUser = await newUser.save();
    // console.log("User saved successfully:", savedUser);
    return savedUser;
  } catch (error) {
    console.error("Error saving user:", error);
    if (error.code === 11000) {
      throw new Error("Email already exists");
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

module.exports = saveUser;
