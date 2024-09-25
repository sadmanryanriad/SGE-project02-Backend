const fs = require("fs");
const path = require("path");

const getFile = async (req, res) => {
  try {
    const filePath = req.params.filePath;
    const fullPath = path.join(__dirname, "/files", filePath);

    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath); // Serve the file directly for preview/download
    } else {
      res.status(404).send({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error serving file:", error.message);
    res.status(500).send({ error: "Failed to retrieve the file" });
  }
};
module.exports = getFile;
