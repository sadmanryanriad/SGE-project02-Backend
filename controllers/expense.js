const Expense = require("../models/expense");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to Base64 encode the email address
const encodeEmail = (email) => {
  return Buffer.from(email).toString("base64");
};

// Set the file size limit (2MB)
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// Ensure that the directory for each encoded email exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage setup to store files in an encoded email directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const encodedEmail = encodeEmail(req.user.email);
    const userDirectory = `files/${encodedEmail}/`;

    // Ensure the user-specific directory exists
    ensureDirectoryExists(userDirectory);


    cb(null, userDirectory);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );

  },
});

// File filter to restrict uploads to PDFs and images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only .pdf, .jpg, .jpeg, and .png formats are allowed!"));
  }
};

// Multer upload setup with file size limit and file type validation
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter,
}).single("receipt");

// Expense creation logic
const createExpense = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }

    console.log('Uploaded file info:', req.file); 
    const { expenseTitle, amount, branch, notes, status, username } = req.body;
    const file = req.file; // Single file
    const userRole = req.user.role;

    if (!expenseTitle || !amount || !branch) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      let receiptFile = null;
      if (file) {
        receiptFile = {
          filename: file.filename,
          path: file.path,
        };
      }

      const expenseData = {
        expenseTitle,
        amount,
        branch,
        notes,
        status:
          userRole === "ceo" || receiptFile
            ? "auto granted"
            : 'pending',
        username,
        role: userRole,
        receipt: receiptFile, // Single file instead of an array
        email: req.user.email,
      };


      const newExpense = new Expense(expenseData);
      const savedExpense = await newExpense.save();

      res.status(201).json({
        message: "Expense created successfully",
        data: savedExpense,
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};

module.exports = createExpense;
