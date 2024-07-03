import { readResult } from './utils/read-json.js';
import { saveDotFile, saveImages } from './utils/save-result.js';
import { execSync } from 'child_process';
import { logDebug } from './utils/logger.js';

class Node {
  name = '';

  constructor(name) {
    this.name = name;
  }

  get nodeStmt() {
    const label = this.label;

    return `  "${label}" [label="${label}",color="${this.#getColor()}",shape=circle,height=0.5,width=0.5,fontsize=9];`;
  }

  get label() {
    const name = this.name;

    if (/\.\/src\//.test(name)) {
      return 'entry';
    }

    if (/\/ui\/parser\//.test(name)) {
      return 'common/ui/parser';
    }

    if (/\/packages\//.test(name)) {
      return /\/packages\/(.*?)\//.exec(name)[1];
    }

    const result = /\/project\/(.*?)\/src/.exec(name);

    return result ? result[1] : name;
  }

  #getColor() {
    return this.#isEntry() ? 'red' : 'black';
  }

  #isEntry() {
    return this.label === 'entry';
  }
}

class GenerateGraph {
  nodes = new Map();
  edges = new Set();

  constructor() {}

  addEdge(from, to) {
    const fromNode = this.#addNode(from);
    const toNode = this.#addNode(to);

    if (!fromNode.label) {
      logDebug(`${from} label is empty`);
    }

    if (!toNode.label) {
      logDebug(`${to} label is empty`);
    }

    // skip self dependency
    if (fromNode.label === toNode.label) {
      return;
    }

    this.edges.add(`"${fromNode.label}" -> "${toNode.label}"`);
  }

  getGraph() {
    const nodes = [...this.nodes.values()].map((node) => {
      return node.nodeStmt;
    });

    const edges = Array.from(this.edges).map((edge) => `  ${edge};`);

    return this.#tempalte(nodes, edges);
  }

  #addNode(node) {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, new Node(node));
    }

    return this.nodes.get(node);
  }

  #tempalte(nodes, edges) {
    return `
digraph G  {
  fontname="Helvetica,Arial,sans-serif"
  node [fontname="Helvetica,Arial,sans-serif"]
  edge [fontname="Helvetica,Arial,sans-serif",len=4]
  layout=neato
  center=""
  node[width=1,height=1,fontsize=9]

${edges.join('\n')}

${nodes.join('\n')}
}
  `.trim();
  }
}

export const generateGraph = async (input) => {
  console.log('Generating graph...', input);

  const issuer = await readResult(input);

  const graph = new GenerateGraph();

  issuer.forEach((module) => {
    graph.addEdge(module.issuerName, module.name);
  });

  const dotFile = saveDotFile(graph.getGraph(), 'graph');
  saveImages(dotFile);
  return dotFile;
};
