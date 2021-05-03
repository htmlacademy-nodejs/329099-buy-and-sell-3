'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const { nanoid } = require(`nanoid`);
const fsP = require(`fs`).promises;
const fs = require(`fs`);
const {
  HttpCode,
  FILE_NAME,
  CATEGORIES_FILE,
  DefaultPort,
  ID_LENGTH,
  OfferValidation,
} = require(`../../constants`);
const { getData } = require(`../../utils`);


const fileContent = fs.readFileSync(FILE_NAME, `utf-8`);
let mocks = fileContent.length ? JSON.parse(fileContent) : [];

const app = express();
app.use(express.json());

app.get(`/search`, (req, res) => {
  const result = mocks.find(({title}) => title.includes(req.query.query));
  result ? res.json(result) : res.send(`Не найдено ни одной публикации`);
});

app.get(`/offers`, (req, res) => {
  res.json(mocks);
});

app.get(`/offers/:offerId`, (req, res) => {
  const offer = mocks.find(({id}) => id === req.params.offerId);
  offer ? res.json(offer) : res.json([]);
});

app.get(`/offers/:offerId/comments`, (req, res) => {
  const offer = mocks.find(({id}) => id === req.params.offerId);
  offer ? res.json(offer.comments) : res.json([]);
});

app.post(`/offers`, (req, res) => {
  const offerData = req.body;
  if (
    !(offerData.category && offerData.category.length)
    || !(offerData.description && (offerData.description.length >= OfferValidation.Description.MIN && offerData.description.length <= OfferValidation.Description.MAX))
    || !(offerData.picture && offerData.picture.length)
    || !(offerData.title && (offerData.title.length >= OfferValidation.Title.MIN && offerData.title.length <= OfferValidation.Title.MAX))
    || !(offerData.type && offerData.type.length)
    || !(Number.parseInt(offerData.sum, 10) >= OfferValidation.Price.MIN)
    ) {
      res.sendStatus(HttpCode.BAD_REQUEST);
  } else {
    console.log(offerData);
    mocks = [...mocks, {
      id: nanoid(ID_LENGTH),
      category: offerData.category,
      description: offerData.description,
      picture: offerData.picture,
      title: offerData.title,
      type: offerData.type,
      sum: Number.parseInt(offerData.sum, 10),
    }]
    res.sendStatus(HttpCode.CREATED);
  }
});

app.post(`/offers/:offerId/comments`, (req, res) => {
  const offerIndex = mocks.findIndex(({id}) => id === req.params.offerId);

  if (offerIndex === -1 || !req.body.text) {
    res.sendStatus(HttpCode.BAD_REQUEST);
  } else {
    mocks[offerIndex].comments = [...mocks[offerIndex].comments, {
      id: nanoid(ID_LENGTH),
      text: req.body.text,
    }];
    res.status(HttpCode.CREATED);
  }
});

app.delete(`/offers/:offerId`, (req, res) => {
  const offerIndex = mocks.findIndex(({id}) => id === req.params.offerId);

  if (offerIndex === -1) {
    res.sendStatus(HttpCode.BAD_REQUEST);
  } else {
    mocks = [].concat(mocks.slice(0, offerIndex), mocks.slice(offerIndex + 1));
    res.sendStatus(HttpCode.NO_CONTENT);
  }
});

app.delete(`/offers/:offerId/comments/:commentId`, (req, res) => {
  const offerIndex = mocks.findIndex(({id}) => id === req.params.offerId);
  const commentsIndex = mocks[offerIndex].comments.findIndex(({id}) => id === req.params.commentId);

  if (offerIndex === -1 || commentsIndex === -1) {
    res.sendStatus(HttpCode.BAD_REQUEST);
  } else {
    mocks[offerIndex].comments = [].concat(mocks[offerIndex].comments.slice(0, commentsIndex), mocks[offerIndex].comments.slice(commentsIndex + 1));
    res.sendStatus(HttpCode.NO_CONTENT);
  }
});

app.get(`/categories`, async (req, res) => {
  try {
    const categories = await getData(CATEGORIES_FILE);
    res.json(categories);
  } catch (err) {
    res.json([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE;
    app.listen(port, () => console.info(chalk.green(`Ожидаю соединений на ${port}`)));
  }
};
