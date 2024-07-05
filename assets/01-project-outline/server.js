// server.js
require("dotenv").config();
const express = require("express");
const { exportImages } = require("../../export_images");

const app = express();
const port = 3000;

app.listen(port, async () => {
  console.log(`This server is now running at http://localhost:${port}`);

  try {
    await exportImages(); // Call the exportImages function when the server starts
    console.log("exportImages() has finished.");
  } catch (error) {
    console.error("Error in exportImages:", error);
  }
});
