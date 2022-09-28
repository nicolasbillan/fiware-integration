var express = require('express');
var router = express.Router();

const Keyrock = require('../helpers/keyrock');

router.post('/login', async function (req, res) {
  return Keyrock.getToken(req.body.email, req.body.password)
    .then((result) => res.json(result))
    .catch((error) => res.status(401).send(error.message));
});

router.post('/authorize', async function (req, res) {
  return Keyrock.validateToken(req.body.token)
    .then((result) => res.json(result))
    .catch((error) => res.status(401).send(error.message));
});

module.exports = router;
