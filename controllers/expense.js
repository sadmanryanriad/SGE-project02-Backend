const Expense = require("../models/expense");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("receipt");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
    stream.end(buffer);
  });
};

const createExpense = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Error uploading file" });
    }

    let { expenseTitle, amount, branch, notes, status, username } = req.body;
    const file = req.file;

    if (!expenseTitle || !amount || !branch) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      let receiptUrl = null;
      if (file) {
        receiptUrl = await uploadToCloudinary(file.buffer);
      }
      if (receiptUrl) {
        status = "auto granted";
      }

      const expenseData = {
        expenseTitle,
        amount,
        branch,
        notes,
        status,
        username,
        role: req.user.role,
        receipt: receiptUrl,
        email: req.user.email,
      };

      const newExpense = new Expense(expenseData);
      const savedExpense = await newExpense.save();

      res
        .status(201)
        .json({ message: "Expense created successfully", data: savedExpense });
    } catch (error) {
      console.error("Error creating expense:", error);

      if (error.name === "ValidationError") {
        const errors = Object.keys(error.errors).map(
          (key) => error.errors[key].message
        );
        return res.status(400).json({ error: errors.join(", ") });
      } else if (error.code === 11000) {
        return res.status(409).json({ error: "Duplicate field value error" });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  });
};

module.exports = createExpense;
