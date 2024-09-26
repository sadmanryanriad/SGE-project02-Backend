const Expense = require("../models/expense");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set the file size limit (2MB)
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// Ensure the /files directory exists
const filesDirectory = path.join(__dirname, "files");
if (!fs.existsSync(filesDirectory)) {
  fs.mkdirSync(filesDirectory, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDirectory); // Files directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Multer upload setup with file size limit and no file type restriction
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
}).single("receipt");

// Expense creation controller
const createExpense = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }

    const { expenseTitle, amount, branch, notes, status, username } = req.body;
    const file = req.file; // Single file
    const userRole = req.user.role;

    if (!expenseTitle || !amount || !branch) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      let receiptFile = null;
      if (file) {
        // Construct the file download URL
        const downloadLink = `${process.env.BACKEND_URL}/file-download/${file.filename}`;
        // Construct the file previewLink URL
        const previewLink = `${process.env.BACKEND_URL}/file/${file.filename}`;

        receiptFile = {
          filename: file.filename,
          humanReadableFileSize: formatFileSize(file.size),
          fileInfo: req.file,
          downloadLink,
          previewLink,
        };
      }

      const expenseData = {
        expenseTitle,
        amount,
        branch,
        notes,
        status: userRole === "ceo" || receiptFile ? "auto granted" : "pending", // CEO and user with receipt get auto granted
        username,
        role: userRole,
        receipt: receiptFile, // Single file
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

// Helper function to convert file size to a human-readable format
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
};

module.exports = createExpense;
