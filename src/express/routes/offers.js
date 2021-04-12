'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/:id(\\d+)`, (req, res) => res.render(`ticket`));
offersRouter.get(`/add`, (req, res) => res.render(`new-ticket`));
offersRouter.get(`/category/:id(\\d+)`, (req, res) => res.render(`category`));
offersRouter.get(`/edit/:id(\\d+)`, (req, res) => res.render(`ticket-edit`));

module.exports = offersRouter;
