const Expense = require("../models/expense");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// const upload = multer({ storage }).single("receipt");
const upload = multer({ storage }).array("receipt"); 

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // Delete the file from the local storage after upload
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

const createExpense = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Error uploading file" });
    }

    let { expenseTitle, amount, branch, notes, status, username } = req.body;
    const files = req.files;
    const userRole = req.user.role; 

    if (!expenseTitle || !amount || !branch) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {

       // Determine the status based on user role and presence of files
       if (userRole === "ceo") {
        status = "auto granted";
      } 

      let receiptUrls = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const receiptUrl = await uploadToCloudinary(file.path);
          receiptUrls.push(receiptUrl);
        }
      }

      if (receiptUrls.length > 0) {
        status = "auto granted";
      }


      const expenseData = {
        expenseTitle,
        amount,
        branch,
        notes,
        status,
        username,
        role: userRole,
        receipt: receiptUrls,
        email: req.user.email,
      };

      const newExpense = new Expense(expenseData);
      const savedExpense = await newExpense.save();

      if (status === "auto granted") {
        res.status(201).json({ message: "Expense added successfully & expense amount has been added", data: savedExpense });
      } else {
        res.status(201).json({ message: "Expense created successfully ,  wait for the expense grant", data: savedExpense });
      }

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