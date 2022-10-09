var express = require('express');
var router = express.Router();

const Travels = require('../data/travel');
const auth = require('../middleware/auth');
const { MESSAGES } = require('../constants/messages');

//TRAVELS

/* GET travels listing. */
router.get('/', auth, async function (req, res, next) {
  return Travels.getTravels()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* GET single Travel */
router.get('/:id', auth, async function (req, res, next) {
  try {
    let result = await Travels.getTravel(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Create Travel */
router.post('/', auth, async function (req, res, next) {
  try {
    await Travels.storeTravel(req.body);
    res.send(MESSAGES.TRAVEL_CREATED);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Update Travel */
router.put('/:id', auth, async function (req, res, next) {
  try {
    await Travels.updateTravel(req.params.id, req.body);
    res.send(MESSAGES.TRAVEL_UPDATED);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Delete Travel */
router.delete('/:id', auth, async function (req, res, next) {
  try {
    await Travels.deleteTravel(req.params.id);
    res.send(MESSAGES.TRAVEL_DELETED);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

//EXPENSES

/* Get all expenses in Travel */
router.get('/:id/expenses/', auth, async function (req, res, next) {
  try {
    let result = await Travels.getExpenses(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Get expense in Travel */
router.get('/:id/expenses/:expId', auth, async function (req, res, next) {
  try {
    let result = await Travels.getExpense(req.params.id, req.params.expId);
    res.json(result);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Create expense in Travel */
router.post('/:id/expenses', auth, async function (req, res, next) {
  try {
    await Travels.storeExpense(req.params.id, req.body);
    res.send(MESSAGES.EXPENSE_CREATED);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Update expense in Travel */
router.put('/:id/expenses/:expId', auth, async function (req, res, next) {
  try {
    await Travels.updateExpense(req.params.id, req.params.expId, req.body);
    res.send(MESSAGES.EXPENSE_UPDATED);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

/* Delete expense in Travel */
router.delete('/:id/expenses/:expId', auth, async function (req, res, next) {
  try {
    await Travels.removeExpense(req.params.id, req.params.expId);
    res.send(MESSAGES.EXPENSE_DELETED);
  } catch (error) {
    res.status(error.code ?? 500).send(error.message);
  }
});

module.exports = router;
