const Orion = require('../helpers/orion');
const Keyrock = require('../helpers/keyrock');
const Parser = require('../parsers/orion');
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

async function getUser(id) {
  return await Orion.getEntity(id);
}

async function getUserByEmail(email) {
  let result = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_USER,
    email: email,
  });

  return result[0];
}

async function storeUser(user) {
  if (await getUserByEmail(user.email)) {
    throw { code: 400, message: MESSAGES.EMAIL_ALREADY_IN_USE };
  }

  await Keyrock.createUser(user);
  Orion.createEntity(Parser.formatUser({ ...Parser.createUser(), ...user }));
}

async function updateUser(id, attributes) {
  await Orion.updateEntity(id, formatAttributes(attributes));
}

module.exports = {
  getUser,
  getUserByEmail,
  storeUser,
  updateUser,
};
