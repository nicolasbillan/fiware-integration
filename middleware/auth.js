const { KEYROCK } = require('../constants/keyrock');
const { MESSAGES } = require('../constants/messages');
const Keyrock = require('../helpers/keyrock');

async function auth(req, res, next) {
  try {
    const token = req.header(KEYROCK.TOKEN_REQUEST_HEADER);

    if (!token) {
      throw { code: 404, message: MESSAGES.TOKEN_NOT_FOUND };
    }

    await Keyrock.validateToken(token)
      .then((res) => {
        next();
      })
      .catch((e) => {
        throw { code: 401, message: MESSAGES.USER_NOT_ALLOWED };
      });
  } catch (error) {
    res.status(error.code ?? 500).send({
      error: error.message ?? MESSAGES.IDENTITY_MANAGER_CONNECTION_ERROR,
    });
  }
}

module.exports = auth;
