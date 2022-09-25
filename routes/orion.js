var express = require('express');
var router = express.Router();

const Orion = require("../helpers/orion");
const auth = require('../middleware/auth');

/* GET travels listing. */
router.get('/travels', async function(req, res, next) {
  res.json(await Orion.getTravels());
});

/* GET single Travel */
router.get('/travels/:id', async function(req, res, next) {
  try {
    let result = await Orion.getTravel(req.params.id);
    res.json(result);
  }
  catch (error) {
    res.status(error.code).send(error.message);
  }
});

/* Create Travel */
router.post('/travels', async function(req, res, next) {
  Orion.storeTravel(req.body)
  .then(res.send("travel created"))
  .catch(e => res.status(500).send(e.message));
});

/* Update Travel */
router.put('/travels/:id', async function(req, res, next) {
  Orion.updateTravel(req.params.id, req.body)
  .then(res.send("travel updated"))
  .catch(e => res.status(500).send(e.message));
});

/* Create expense in Travel */
router.post('/travels/:id/expenses', async function(req, res, next) {
  try {
    let result = await Orion.storeExpense(req.params.id, req.body);
    res.send(result);
  }
  catch (error){
    console.log(error.message);
    res.status(500).json({})
  }
});

/* Get expense in Travel */
router.get('/travels/:traId/expenses/:expId', async function(req, res, next) {
  try {
    let result = await Orion.getExpense(req.params.traId, req.params.expId);
    res.json(result);
  }
  catch (error) {
    res.status(error.code).send(error.message)
  }
});

/* Update expense in Travel */
router.get('/travels/:traId/expenses/:expId', async function(req, res, next) {
  try {
    let result = await Orion.updateExpense(req.params.traId, req.params.expId, req.body);
    res.json(result);
  }
  catch (error) {
    res.status(error.code).send(error.message)
  }
});

/* Delete expense in Travel */
router.delete('/travels/:traId/expenses/:expId', async function(req, res, next) {
  try {
    let result = await Orion.removeExpense(req.params.traId, req.params.expId);
    res.send(result);
  }
  catch (error) {
    res.status(error.code).send(error.message)
  }
});

// router.get('/expenses/:id', async function(req, res, next) {
//   Orion.storeTravel(req.body)
//   .then(res.send("travel created"))
//   .catch(e => res.status(500).send(e.message));
// });

module.exports = router;
