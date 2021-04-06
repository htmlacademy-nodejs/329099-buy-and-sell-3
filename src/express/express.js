'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const loginRouter = require(`./routes/login`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const offersRouter = require(`./routes/offers`);
const registerRouter = require(`./routes/register`);
const searchRouter = require(`./routes/search`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, mainRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use(`/register`, registerRouter);
app.use(`/search`, searchRouter);

app.listen(DEFAULT_PORT, () => console.info(chalk.green(`Сервер запущен на порту: ${DEFAULT_PORT}`)));
