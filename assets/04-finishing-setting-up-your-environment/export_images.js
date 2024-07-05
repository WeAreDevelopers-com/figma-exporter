// export_images.js
require("dotenv").config();
const fs = require("fs");

console.log("FIGMA_API_TOKEN: ", process.env.FIGMA_API_TOKEN);
console.log("FILE_KEY :", process.env.FILE_KEY);

const EXPORT_DIRECTORY = "./exports";
if (!fs.existsSync(EXPORT_DIRECTORY)) {
  fs.mkdirSync(EXPORT_DIRECTORY);
}

function exportImages() {
  console.log("The exportImages() function has fired.");
}

module.exports = { exportImages };
