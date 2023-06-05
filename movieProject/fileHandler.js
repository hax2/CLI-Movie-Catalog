const fs = require('fs').promises;

async function readJSONFile(filename) {
  const data = await fs.readFile(filename, 'utf8');
  return JSON.parse(data);
}

async function writeJSONFile(filename, data) {
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

module.exports = { readJSONFile, writeJSONFile };
