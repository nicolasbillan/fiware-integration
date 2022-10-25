var express = require('express');
var router = express.Router();

const Travels = require('../data/travel');
const auth = require('../middleware/auth');
const { MESSAGES } = require('../constants/messages');

//TRAVELS

/* GET travels listing. */
router.get('/', auth, async function (req, res, next) {
  //TODO: filters (title, dates, etc...)
  return Travels.getTravels({ user: req.params.userId })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* GET single Travel */
router.get('/:id', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Create Travel */
router.post('/', auth, async function (req, res, next) {
  let travel = {
    ...req.body,
    user: req.params.userId,
  };

  await Travels.storeTravel(travel)
    .then(() => res.send(MESSAGES.TRAVEL_CREATED))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Update Travel */
router.put('/:id', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() => Travels.updateTravel(req.params.id, req.body))
    .then(() => res.send(MESSAGES.TRAVEL_UPDATED))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Delete Travel */
router.delete('/:id', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() => Travels.deleteTravel(req.params.id))
    .then(() => res.send(MESSAGES.TRAVEL_DELETED))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

//EXPENSES

/* Get all expenses in Travel */
router.get('/:id/expenses/', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() => Travels.getExpenses(req.params.id))
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Get expense in Travel */
router.get('/:id/expenses/:expId', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() => Travels.getExpense(req.params.id, req.params.expId))
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Create expense in Travel */
router.post('/:id/expenses', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() => Travels.storeExpense(req.params.id, req.body))
    .then(() => res.send(MESSAGES.EXPENSE_CREATED))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Update expense in Travel */
router.put('/:id/expenses/:expId', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() =>
      Travels.updateExpense(req.params.id, req.params.expId, req.body)
    )
    .then(() => res.send(MESSAGES.EXPENSE_UPDATED))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* Delete expense in Travel */
router.delete('/:id/expenses/:expId', auth, async function (req, res, next) {
  return Travels.getTravel(req.params.id, req.params.userId)
    .then(() => Travels.removeExpense(req.params.id, req.params.expId))
    .then(() => res.send(MESSAGES.EXPENSE_DELETED))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

module.exports = router;
