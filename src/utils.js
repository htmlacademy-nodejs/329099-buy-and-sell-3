'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;
const { DATA_DIR } = require(`./constants`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getData = async (fileName) => {
  try {
    const filePath = path.join(process.cwd(), DATA_DIR, fileName);
    const file = await fs.readFile(filePath);
    return file.toString().split(`\n`).slice(0, -1);
  } catch (error) {
    return console.error(`Can't open file...\n${error}`);
  }
};
