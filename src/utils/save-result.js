import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';
import { execSync } from 'child_process';
import { paths } from './paths.js';

let resultPath = path.join(paths.resultDir, dayjs().format('YYYY-MM-DD-HH-mm-ss'));

const saveResultFile = (data, fileName) => {
  // RESULT_PATH will be set in `continue` mode
  resultPath = process.env.RESULT_PATH || resultPath;

  fsExtra.ensureDir(resultPath);

  const resultFilePath = path.join(resultPath, fileName);

  fs.writeFileSync(resultFilePath, data);

  return resultFilePath;
};

export const saveResultJson = (data, prefix) => {
  return saveResultFile(JSON.stringify(data, null, 2), `${prefix}.json`);
};

export const saveDotFile = (data, prefix) => {
  return saveResultFile(data, `${prefix}.dot`);
};

export const saveImages = (file) => {
  execSync(`dot -Tsvg ${file} -o ${resultPath}/graph.svg -Kneato`);
  execSync(`dot -Tpng ${file} -o ${resultPath}/graph.png -s10 -Kneato`);
  execSync(`dot -Txdot_json ${file} -o ${resultPath}/graph.json`);
};
