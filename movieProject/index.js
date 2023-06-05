const readline = require('readline');
const fileHandler = require('./fileHandler');
const movieManager = require('./movieManager');
const apiHandler = require('./apiHandler');
const uiHandler = require('./uiHandler');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

uiHandler.start(rl, fileHandler, movieManager, apiHandler);
