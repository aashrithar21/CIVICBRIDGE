
const fs = require("fs/promises");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");

async function readData(filename) {
  const filePath = path.join(dataDirectory, filename);

  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeData(filename, []);
      return [];
    }

    throw error;
  }
}

async function writeData(filename, data) {
  const filePath = path.join(dataDirectory, filename);
  const temporaryPath = `${filePath}.tmp`;

  await fs.mkdir(dataDirectory, { recursive: true });

  await fs.writeFile(
    temporaryPath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  await fs.rename(temporaryPath, filePath);
}

module.exports = { readData, writeData };
