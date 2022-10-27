var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const Keyrock = require('../helpers/keyrock');
const Users = require('../data/users');
const { MESSAGES } = require('../constants/messages');

async function createToken(token, email) {
  let user = await Users.getUserByEmail(email);
  let tokenObject = { id: user.id, token: token.value };
  console.log(tokenObject);
  return jwt.sign(tokenObject, process.env.SECRET_KEY, { expiresIn: '24h' });
}

router.get('/:email', async function (req, res) {
  return Users.getUserByEmail(req.params.email)
    .then((result) => res.json(result))
    .catch((error) => res.status(error.code).send(error.message));
});

router.post('/login', async function (req, res) {
  return Keyrock.getToken(req.body.email, req.body.password)
    .then((result) =>
      createToken(result, req.body.email).then((result) => res.json(result))
    )
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

router.post('/register', async function (req, res) {
  await Users.storeUser({ email: req.body.email, password: req.body.password })
    .then(() => {
      res.send();
    })
    .catch((error) => res.status(error.code ?? 500).send(error.message));
});

module.exports = router;
