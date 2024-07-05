// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const { exportImages } = require("./export_images");

const app = express();
const port = 3000;

// Serve the static HTML file from the root directory
app.use(express.static(path.join(__dirname)));

app.listen(port, async () => {
  console.log(`This server is now running at http://localhost:${port}`);

  try {
    await exportImages(); // Call the exportImages function when the server starts
    console.log("exportImages() has finished.");
  } catch (error) {
    console.error("Error in exportImages:", error);
  }
});
