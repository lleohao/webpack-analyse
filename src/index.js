import fs from 'node:fs';
import path from 'node:path';
import fsExtra from 'fs-extra';
import { filterModules } from './filter-modules.js';
import { getIssuer } from './get-issuer.js';
import { generateGraph } from './generate-graph.js';
import { logError, logInfo } from './utils/logger.js';
import inquirer from 'inquirer';
import { paths } from './utils/paths.js';
import * as constants from 'node:constants';

const { pathExistsSync } = fsExtra;

const createAnalyze = async () => {
  const analyseFolder = process.env.WEBPACK_ANALYSE_FOLDER;

  if (!analyseFolder) {
    logError('Must set WEBPACK_ANALYSE_FOLDER environment variable');
    process.exit(1);
  }

  if (!pathExistsSync(analyseFolder)) {
    logError(`Folder ${analyseFolder} does not exist`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(analyseFolder)
    .filter((file) => file.endsWith('json'))
    .reverse();

  const { file } = await inquirer.prompt([
    {
      name: 'file',
      type: 'list',
      choices: files,
    },
  ]);

  const filePath = path.join(analyseFolder, file);

  filterModules(filePath)
    .then((input) => getIssuer(input))
    .then((input) => generateGraph(input));
};

const continueAnalyze = async () => {
  logInfo('In continue mode');

  const resultsFolders = fs
    .readdirSync(paths.resultDir, {
      withFileTypes: false,
    })
    .filter((file) => !file.startsWith('.'))
    .reverse();

  if (resultsFolders.length === 0) {
    logError(`There is no result can continue analyse`);
    process.exit(1);
  }

  const { result } = await inquirer.prompt([
    { type: 'list', choices: resultsFolders, name: 'result', default: resultsFolders[0] },
  ]);

  process.env.RESULT_PATH = path.join(paths.resultDir, result);

  const issuerResultFilePath = path.join(process.env.RESULT_PATH, 'issuer.json');
  await generateGraph(issuerResultFilePath);
};

(async () => {
  // Continue to analyze results from the previous result
  if (process.argv.indexOf('--continue') !== -1) {
    await continueAnalyze();
  } else {
    await createAnalyze();
  }
})();
