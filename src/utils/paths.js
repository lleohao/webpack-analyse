import path from 'node:path';

const root = path.join(import.meta.dirname, '../../');

export const paths = {
  root,
  resultDir: path.join(root, 'results'),
};
