require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
const EXPORT_DIRECTORY = "./exports";

if (!fs.existsSync(EXPORT_DIRECTORY)) {
  fs.mkdirSync(EXPORT_DIRECTORY);
}

console.log("Environment and export directory setup complete.");

async function getFileNodes(fileKey) {
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  const headers = { "X-Figma-Token": FIGMA_API_TOKEN };

  try {
    console.log(`Requesting file nodes from: ${url}`);
    const response = await axios.get(url, { headers });
    console.log(
      `File nodes response: ${JSON.stringify(response.data.document.children)}`
    );
    return response.data.document.children;
  } catch (error) {
    console.error("Error getting file nodes:", error);
    throw error;
  }
}

async function exportImages() {
  console.log("Starting exportImages function");

  // Step 2: Test getFileNodes function
  const fileNodes = await getFileNodes(FILE_KEY);
  console.log("The file nodes are: ", fileNodes);
}

// Export the exportImages function
module.exports = { exportImages };
