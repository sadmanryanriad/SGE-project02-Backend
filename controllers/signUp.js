const sendMail = require("../others/sendEmail");
const saveUser = require("../controllers/users/saveUser");

const signUp = async (req, res) => {
  const user = req.body;
  console.log(
    `sending email to: ${user?.email} username: ${user?.firstName} ${user?.lastName}`
  );

  try {
    const savedUser = await saveUser(user);
    // if user not saved
    if (!savedUser) {
      return res
        .status(500)
        .json({ message: "Internal server error. User not saved!" });
    }

    res
      .status(201)
      .json({ message: "Sign-up successful and email will be sent" });

    // send email
    try {
      await sendMail(
        user.email,
        "Welcome to Our App",
        `Hello ${user.firstName} ${user.lastName}, welcome to our app!`,
        `<p>Hello <strong>${user?.firstName} ${user?.lastName}</strong>, welcome to our app!</p>`
      );
    } catch (emailError) {
      console.error(`Error sending email to: ${email}`, emailError);
    }
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = signUp;
