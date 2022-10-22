const { KEYROCK } = require('../constants/keyrock');
const { MESSAGES } = require('../constants/messages');
const Keyrock = require('../helpers/keyrock');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function auth(req, res, next) {
  try {
    let token = req.header(KEYROCK.TOKEN_REQUEST_HEADER);

    if (!token) {
      throw { code: 404, message: MESSAGES.TOKEN_NOT_FOUND };
    }

    try {
      //  decript token
      let tokenObject = jwt.verify(token, config.SECRET_KEY);

      //  validate token
      await Keyrock.validateToken(tokenObject.token).then((res) => {
        // add userid to req
        req.params.userId = tokenObject.id;
        next();
      });
    } catch {
      throw { code: 401, message: MESSAGES.USER_NOT_ALLOWED };
    }
  } catch (error) {
    res.status(error.code ?? 500).send({
      error: error.message ?? MESSAGES.IDENTITY_MANAGER_CONNECTION_ERROR,
    });
  }
}

module.exports = auth;
