// ES module version
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to public/scriptures
const scriptureFolder = path.join(__dirname, "public", "scriptures");
const outputFile = path.join(scriptureFolder, "strongs_index.json");


const scriptureFiles = [
  "old_testament.json",
  "new_testament.json",
  "book_of_mormon.json",
  "doctrine_and_covenants.json",
  "pearl_of_great_price.json",
];

const strongsIndex = {};

const extractStrongsCodes = (text) => {
  const regex = /\{([HG]\d+)\}/g;
  const codes = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    codes.push(match[1]);
  }
  return codes;
};

for (const file of scriptureFiles) {
  const filePath = path.join(scriptureFolder, file);
  console.log("Reading file:", filePath);

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.forEach((verse) => {
    const codes = extractStrongsCodes(verse.strongs_text);
    codes.forEach((code) => {
      if (!strongsIndex[code]) strongsIndex[code] = [];
      strongsIndex[code].push(verse.unique_id);
    });
  });
}

fs.writeFileSync(outputFile, JSON.stringify(strongsIndex, null, 2), "utf-8");
console.log("Strong's index generated at:", outputFile);
