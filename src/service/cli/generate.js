'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);


const FILE_NAME = `mocks.json`;
const DATA_DIR = `data`;
const CATEGORIES_FILE = `categories.txt`;
const SENTENCES_FILE = `sentences.txt`;
const TITLES_FILE = `titles.txt`;
const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};
const Count = {
  DEFAULT: 1,
  MAX: 1000,
};
const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};
const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getData = async (fileName) => {
  try {
    const filePath = path.join(process.cwd(), DATA_DIR, fileName);
    const file = await fs.readFile(filePath);
    return file.toString().split(`\n`).slice(0, -1);
  } catch (error) {
    return console.error(`Can't open file...\n${error}`);
  }
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = async (count) => {
  const categories = await getData(CATEGORIES_FILE);
  const sentences = await getData(SENTENCES_FILE);
  const titles = await getData(TITLES_FILE);

  return Array(count).fill({}).map(() => ({
    category: shuffle(categories).slice(1, getRandomInt(2, categories.length - 1)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;

    if (count > Count.MAX) {
      console.error(chalk.red(`Не больше ${Count.MAX} объявлений.`));
      process.exit(ExitCode.SUCCESS);
    }

    const countOffer = Number.parseInt(count, 10) || Count.DEFAULT;
    const content = JSON.stringify(await generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...\n${error}`));
      process.exit(ExitCode.ERROR);
    }
  }
};
