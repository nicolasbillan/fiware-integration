var express = require('express');
var router = express.Router();

const Keyrock = require('../helpers/keyrock');
const Users = require('../data/users');

router.get('/:email', async function (req, res) {
  return Users.getUserByEmail(req.params.email)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code).send(error.message));
});

router.post('/login', async function (req, res) {
  return Keyrock.getToken(req.body.email, req.body.password)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code).send(error.message));
});

router.post('/register', async function (req, res) {
  await Keyrock.createUser({
    email: req.body.email,
    password: req.body.password,
  })
    .then((result) => {
      res.send('User Created');
    })
    .catch((error) => res.status(error.code).send(error.message));
});

module.exports = router;
