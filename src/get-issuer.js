import { readResult } from './utils/read-json.js';
import { saveResultJson } from './utils/save-result.js';

export const getIssuer = async (input) => {
  console.log('Getting issuer...', input);

  const pojo = await readResult(input);

  const result = pojo
    .map((module) => {
      const { name, issuerName } = module;

      if (!name || !issuerName) {
        return null;
      }

      if (!/[jt]sx?$/.test(name)) {
        return null;
      }

      return {
        name,
        issuerName,
      };
    })
    .filter(Boolean);

  return saveResultJson(result, 'issuer');
};
