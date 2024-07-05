require("dotenv").config();
const express = require("express");
const path = require("path");
const { exportImages } = require("../../export_images");

const app = express();
const port = 3000;

// Serve the static HTML file from the root directory
app.use(express.static(path.join(__dirname)));

// Endpoint to run the export script
app.post("/run-export-script", async (req, res) => {
  try {
    console.log("Received request to run exportImages");
    await exportImages();
    res.json({ message: "Images exported successfully!" });
  } catch (error) {
    console.error("Error in exportImages:", error);
    res.json({ message: `Error: ${error.message}` });
  }
});

// Start the server and listen on the specified port
app.listen(port, async () => {
  console.log(`This server is now running at http://localhost:${port}`);
});
