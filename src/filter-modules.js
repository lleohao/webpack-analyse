import { readJson } from './utils/read-json.js';
import { saveResultJson } from './utils/save-result.js';

export const filterModules = async (input) => {
  console.log('Filter modules...', input);

  const pojo = await readJson(input);

  const packages = pojo['modules'].filter((module) => {
    return !/\/node_modules\//.test(module.name);
  });

  return saveResultJson(packages, 'modules');
};
