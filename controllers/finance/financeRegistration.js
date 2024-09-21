const Finance = require("../../models/Finance"); // MongoDB model for finance users
const saveUser = require("../../controllers/users/saveUser"); // Utility function for saving user data
const sendEmail = require("../../others/sendEmail"); // Email sending utility
const admin = require("../../others/firebaseService"); // Initialized Firebase Admin SDK

const financeRegistration = async (req, res) => {
  const { firstName, lastName, email, password, branch } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !branch) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // First, create the Firebase account
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Save user data to MongoDB
    const user = {
      firstName,
      lastName,
      email,
      password, // Hash the password before saving if necessary
      branch,
      role: "finance",
      firebaseUid: firebaseUser.uid, // Save the Firebase UID for reference
    };
    const savedUser = await saveUser(user);

    // Save finance-specific data to MongoDB
    const newFinance = new Finance({
      firstName,
      lastName,
      email,
    });
    const savedFinance = await newFinance.save();

    if (!savedFinance) {
      // If saving finance data fails, delete the Firebase user to maintain consistency
      await admin.auth().deleteUser(firebaseUser.uid);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(201).json({
      message: "Finance user registered successfully",
      user: {
        name: `${firstName} ${lastName}`,
        email: savedUser.email,
        role: savedUser.role,
      },
    });

    // Send email notifications asynchronously
    const emailSubject = "Welcome to Finance Team";
    const emailText =
      `Dear ${firstName} ${lastName},\n\n` +
      `You are now registered as a Finance user.\n\n` +
      `You can log in to your account.\n\n`;
    sendEmail(email, emailSubject, emailText).catch(console.error);
  } catch (error) {
    // Handle Firebase-specific errors
    if (error.code && error.code.startsWith("auth/")) {
      return res
        .status(400)
        .json({ message: `Firebase error: ${error.message}` });
    }

    // Handle MongoDB duplicate email error
    if (
      error.message === "Email already exists" ||
      (error.code === 11000 && error.keyPattern && error.keyPattern.email)
    ) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      return res.status(400).json({ errors });
    }

    // Catch-all for other errors
    res.status(500).json({ message: error.message });
  }
};

module.exports = financeRegistration;
