const crypto = require('crypto');
const Orion = require('../helpers/orion');
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

function generateId() {
  return crypto.randomUUID();
}

async function getUser(id) {
  return await Orion.getEntity(id);
}

async function getUserByEmail(email) {
  let result = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_USER,
    email: email,
  });
  let user = result[0];

  if (!user) {
    throw { code: 404, message: 'User not found' };
  }

  return user;
}

async function storeUser(user) {
  //check user in orion
  //create user in keyrock
  //create user in orion
  await Orion.createEntity(createUser(user));
}

async function updateUser(id, attributes) {
  await Orion.updateEntity(id, formatAttributes(attributes));
}

function createUser(attributes) {
  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_USER,
    email: {
      type: 'Text',
      value: attributes.email,
    },
  };
}

module.exports = {
  getUser,
  getUserByEmail,
  storeUser,
  updateUser,
};
