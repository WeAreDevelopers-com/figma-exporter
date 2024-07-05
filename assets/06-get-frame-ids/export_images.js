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

// Function to collect frame node IDs and names from top-level groups
function collectFrameNodeIds(node, nodes = [], isTopLevel = true) {
  if (node.type === "FRAME" && isTopLevel) {
    nodes.push({ id: node.id, name: node.name }); // Add top-level frame ID and name
  }
  if (node.type === "GROUP" && isTopLevel) {
    node.children.forEach((child) => {
      if (child.type === "FRAME") {
        nodes.push({ id: child.id, name: child.name }); // Add second-level frame IDs and names within groups
      }
    });
  }
  if (node.children) {
    node.children.forEach((child) => collectFrameNodeIds(child, nodes, false));
  }
  return nodes;
}

// Function to find the "Staging" page and collect all relevant frame IDs and names
function collectFrameIdsFromStaging(pages) {
  const stagingPage = pages.find((page) => page.name === "Staging");
  if (!stagingPage) {
    console.error("Staging page not found");
    return [];
  }

  const nodes = [];
  stagingPage.children.forEach((node) => {
    collectFrameNodeIds(node, nodes);
  });

  return nodes;
}

async function exportImages() {
  console.log("Starting exportImages function");

  // Step 2: Get file nodes
  const fileNodes = await getFileNodes(FILE_KEY);
  console.log("The file nodes are: ", fileNodes);

  // Step 3: Collect frame node IDs and names
  const stagingNodes = collectFrameIdsFromStaging(fileNodes);
  console.log(
    "Collected frame IDs and names from Staging page: ",
    stagingNodes
  );
}

// Export the exportImages function
module.exports = { exportImages };
