var express = require('express');
var router = express.Router();

const Travels = require('../data/travel');
const auth = require('../middleware/auth');

//TODO: AUTH

//TRAVELS

/* GET travels listing. */
router.get('/', async function (req, res, next) {
  try {
    res.json(await Travels.getTravels());
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* GET single Travel */
router.get('/:id', async function (req, res, next) {
  try {
    let result = await Travels.getTravel(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Create Travel */
router.post('/', async function (req, res, next) {
  try {
    await Travels.storeTravel(req.body);
    res.send('Travel created');
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Update Travel */
router.put('/:id', async function (req, res, next) {
  try {
    await Travels.updateTravel(req.params.id, req.body);
    res.send('Travel updated');
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Delete Travel */
router.delete('/:id', async function (req, res, next) {
  try {
    await Travels.deleteTravel(req.params.id);
    res.send('Travel deleted');
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

//EXPENSES

/* Get all expenses in Travel */
router.get('/:id/expenses/', async function (req, res, next) {
  try {
    let result = await Travels.getExpenses(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Get expense in Travel */
router.get('/:id/expenses/:expId', async function (req, res, next) {
  try {
    let result = await Travels.getExpense(req.params.id, req.params.expId);
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Create expense in Travel */
router.post('/:id/expenses', async function (req, res, next) {
  try {
    await Travels.storeExpense(req.params.id, req.body);
    res.send('Expense created');
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Update expense in Travel */
router.put('/:id/expenses/:expId', async function (req, res, next) {
  try {
    let result = await Travels.updateExpense(
      req.params.id,
      req.params.expId,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Delete expense in Travel */
router.delete('/:id/expenses/:expId', async function (req, res, next) {
  try {
    let result = await Travels.removeExpense(req.params.id, req.params.expId);
    res.send(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

module.exports = router;
