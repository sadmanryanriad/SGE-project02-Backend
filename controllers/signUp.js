const sendMail = require("../others/sendEmail");
const saveUser = require("../controllers/users/saveUser");
const saveBudget = require("../controllers/users/saveBudget");
const admin = require("../others/firebaseService");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password, branch } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !branch) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const emailToSave = email.toLowerCase().trim();

  try {
    // First, create the Firebase account
    const firebaseUser = await admin.auth().createUser({
      email: emailToSave,
      password,
      displayName: `${firstName} ${lastName}`,
    });
    console.log(firebaseUser);

    // Save user data
    const user = {
      firstName,
      lastName,
      email: emailToSave,
      password,
      branch,
      role: "employee",
      firebaseUid: firebaseUser.uid,
    };
    // Save user data
    const budget = {
      name: firstName + " " + lastName,
      email: emailToSave,
      branch,
      role: "employee",
      firebaseUid: firebaseUser.uid,
    };

    const savedUser = await saveUser(user);
    const savedBudget = await saveBudget(budget);

    if (!savedUser || !savedBudget) {
      await admin.auth().deleteUser(firebaseUser.uid);
      if (savedUser) {
        await deleteUser(savedUser._id); // Delete from MongoDB if user was saved
      }
      return res.status(500).json("Internal server error");
    }

    res.status(201).json({
      message:
        "Employee registered successfully. Email has been sent to your email.",
      user: {
        name: `${firstName} ${lastName}`,
        email: savedUser.email,
        role: savedUser.role,
      },
    });

    // Send email notifications asynchronously
    const emailSubject = "Welcome to Shabuj Global Education";
    const emailText =
      `Dear  ${firstName} ${lastName}\n\n` +
      `You are now a employee of ${branch}.\n\n` +
      `You can login to your dashboard.\n\n`;
    sendMail(email, emailSubject, emailText).catch(console.error);
  } catch (error) {
    // Handle the duplicate email error
    if (error.message === "Email already exists") {
      res.status(400).json({ message: "Email already exists" });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email
    ) {
      res.status(400).json({ message: "Email already exists" });
    } else if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      res.status(400).json({ errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = signUp;
