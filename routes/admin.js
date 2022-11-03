var express = require('express');
var router = express.Router();

const Admin = require('../data/admin');
const Keyrock = require('../helpers/keyrock');
const { formatResponse } = require('../parsers/apiResponse');
//TODO: const adminAuth = require('../middleware/adminAuth');

router.post('/login', async function (req, res, next) {
  return Keyrock.getToken(req.body.email, req.body.password)
    .then(() => Admin.validateAdmin(req.body.email))
    .then(() => res.send())
    .catch((error) =>
      res.status(error.code ?? 500).json(formatResponse(error.message))
    );
});

/* GET travels summary */
router.get('/travels', async function (req, res, next) {
  return Admin.getTravelsSummary(req.query.period)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* GET users summary */
router.get('/users', async function (req, res, next) {
  return Admin.getUsersSummary(req.query.period)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

/* GET expenses summary */
router.get('/expenses', async function (req, res, next) {
  return Admin.getExpensesSummary(req.query.group, req.query.period)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

module.exports = router;
