import json from "big-json";
import fs from "fs";
import path from "path";

export const readJson = (filePath) => {
  const readStream = fs.createReadStream(filePath);
  const parseStream = json.createParseStream();

  return new Promise((resolve, reject) => {
    readStream.pipe(parseStream);
    parseStream.on("data", resolve);
    parseStream.on("error", reject);
  });
};

export const readResult = (fileName) => {
  let filePath = fileName;

  if (!path.isAbsolute(fileName)) {
    filePath = path.join(import.meta.dirname, "../../result", fileName);
  }

  return readJson(filePath);
};
