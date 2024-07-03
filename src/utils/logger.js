import chalk from 'chalk';

export const logError = (message) => {
  console.error(chalk.red(message));
};

export const logDebug = (message) => {
  console.log(chalk.grey(message));
};

export const logInfo = (...args) => {
  console.log(chalk.blue(...args));
};
