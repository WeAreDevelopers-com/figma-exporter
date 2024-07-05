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

async function getImageUrls(fileKey, nodeIds) {
  const url = `https://api.figma.com/v1/images/${fileKey}`;
  const params = { ids: nodeIds.join(","), format: "png" };
  const headers = { "X-Figma-Token": FIGMA_API_TOKEN };

  try {
    console.log(
      `Requesting image URLs from: ${url} with params: ${JSON.stringify(
        params
      )}`
    );
    const response = await axios.get(url, { params, headers });
    console.log(`Image URLs response: ${JSON.stringify(response.data.images)}`);
    return response.data.images;
  } catch (error) {
    console.error("Error getting image URLs:", error);
    throw error;
  }
}

async function downloadImage(imageUrl, outputPath) {
  try {
    if (!imageUrl) {
      throw new Error("Image URL is null or undefined");
    }
    console.log(`Downloading image from URL: ${imageUrl}`);
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading image from ${imageUrl}:`, error);
    throw error;
  }
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

  // Step 4: Get image URLs for the nodes
  const frameIds = stagingNodes.map((node) => node.id);
  const imageUrls = await getImageUrls(FILE_KEY, frameIds);
  console.log("The image URLs are: ", imageUrls);

  // Step 5: Download each image and save it to the export directory with the correct name
  for (const { id, name } of stagingNodes) {
    const imageUrl = imageUrls[id];
    if (!imageUrl) {
      console.warn(
        `Skipping node ${id} because the image URL is null or undefined`
      );
      continue;
    }
    const sanitizedFileName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase(); // Sanitize the file name
    const outputPath = path.join(EXPORT_DIRECTORY, `${sanitizedFileName}.png`);
    console.log(`Saving image to: ${outputPath}`);
    await downloadImage(imageUrl, outputPath);
    console.log(`Exported image: ${outputPath}`);
  }
}

// Export the exportImages function
module.exports = { exportImages };
