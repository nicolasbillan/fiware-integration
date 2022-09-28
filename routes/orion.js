var express = require('express');
var router = express.Router();

const Orion = require('../helpers/orion');
const auth = require('../middleware/auth');

//TODO: AUTH

//TRAVELS

/* GET travels listing. */
router.get('/travels', async function (req, res, next) {
  try {
    res.json(await Orion.getTravels());
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* GET single Travel */
router.get('/travels/:id', async function (req, res, next) {
  try {
    let result = await Orion.getTravel(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Create Travel */
router.post('/travels', async function (req, res, next) {
  try {
    let result = await Orion.storeTravel(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Update Travel */
router.put('/travels/:id', async function (req, res, next) {
  try {
    await Orion.updateTravel(req.params.id, req.body);
    res.send('Travel updated');
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Delete Travel */
router.delete('/travels/:id', async function (req, res, next) {
  try {
    await Orion.deleteTravel(req.params.id);
    res.send('Travel deleted');
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

//EXPENSES

/* Get all expenses in Travel */
router.get('/travels/:id/expenses/', async function (req, res, next) {
  try {
    let result = await Orion.getExpenses(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Get expense in Travel */
router.get('/travels/:traId/expenses/:expId', async function (req, res, next) {
  try {
    let result = await Orion.getExpense(req.params.traId, req.params.expId);
    res.json(result);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Create expense in Travel */
router.post('/travels/:id/expenses', async function (req, res, next) {
  try {
    await Orion.storeExpense(req.params.id, req.body);
    res.send('Expense created');
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Update expense in Travel */
router.put('/travels/:traId/expenses/:expId', async function (req, res, next) {
  try {
    let result = await Orion.updateExpense(
      req.params.traId,
      req.params.expId,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Delete expense in Travel */
router.delete(
  '/travels/:traId/expenses/:expId',
  async function (req, res, next) {
    try {
      let result = await Orion.removeExpense(
        req.params.traId,
        req.params.expId
      );
      res.send(result);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  }
);

module.exports = router;
