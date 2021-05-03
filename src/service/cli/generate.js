'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const { nanoid } = require(`nanoid`);
const {
  ExitCode,
  FILE_NAME,
  CATEGORIES_FILE,
  SENTENCES_FILE,
  TITLES_FILE,
  COMMENTS_FILE,
  ID_LENGTH,
} = require(`../../constants`);
const {
  getRandomInt,
  shuffle,
  getData,
} = require(`../../utils`);


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

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = async (count) => {
  const categories = await getData(CATEGORIES_FILE);
  const sentences = await getData(SENTENCES_FILE);
  const titles = await getData(TITLES_FILE);
  const comments = await getData(COMMENTS_FILE);

  return Array(count).fill({}).map(() => ({
    id: nanoid(ID_LENGTH),
    category: shuffle(categories).slice(1, getRandomInt(2, categories.length - 1)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: Array(getRandomInt(1, comments.length - 1)).fill({}).map(() => ({id: nanoid(ID_LENGTH), text: comments[getRandomInt(0, comments.length - 1)]})),
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
