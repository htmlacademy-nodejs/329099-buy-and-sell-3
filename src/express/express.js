'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);
const loginRouter = require(`./routes/login`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const offersRouter = require(`./routes/offers`);
const registerRouter = require(`./routes/register`);
const searchRouter = require(`./routes/search`);
const { DefaultPort } = require(`../constants`);

const PUBLIC_DIR = `public`;
const TEMPLATE_DIR = `templates`;

const app = express();

app.set(`views`, path.resolve(__dirname, TEMPLATE_DIR));
app.set(`view engine`, `pug`);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, mainRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use(`/register`, registerRouter);
app.use(`/search`, searchRouter);

app.use((req, res, next) => res.render(`404`));
app.use((err, req, res, next) => res.render(`500`));

app.listen(DefaultPort.EXPRESS, () => console.info(chalk.green(`Сервер запущен на порту: ${DefaultPort.EXPRESS}`)));
