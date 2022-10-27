const axios = require('axios').default;
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

const ORION_LOCAL_API_URL = 'http://localhost:1026/v2/';

function handleException(e) {
  throw {
    code: e.response?.status ?? 500,
    message: e.response?.statusText ?? MESSAGES.CONTEXT_BROKER_CONNECTION_ERROR,
  };
}

async function getEntity(id) {
  return axios
    .get(`${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => handleException(e));
}

async function getAttribute(id, attribute) {
  return axios
    .get(
      `${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}/${id}/${ORION.ATTRIBUTES_CONTROLLER}/${attribute}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => handleException(e));
}

async function getEntities(parameters) {
  if (!parameters.type) {
    throw { code: 400, message: 'Type filter missing' };
  }

  let url = `${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}?type=${parameters.type}`;

  if (parameters.attribute) {
    url += `&attrs=${parameters.attribute}`;
  }

  //todo: multiple filter
  if (parameters.email) {
    url += `&q=email==${parameters.email}`;
  }

  if (parameters.user) {
    url += `&q=user==${parameters.user}`;
  }

  return axios
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((e) => handleException(e));
}

async function createEntity(body) {
  return axios
    .post(`${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}`, body)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

async function updateEntity(id, body) {
  return axios
    .post(
      `${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}/${id}/${ORION.ATTRIBUTES_CONTROLLER}`,
      body
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

async function updateAttribute(id, attribute, body) {
  await axios
    .put(
      `${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}/${id}/${ORION.ATTRIBUTES_CONTROLLER}/${attribute}`,
      body
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

async function deleteEntity(id) {
  return axios
    .delete(`${ORION_LOCAL_API_URL}${ORION.ENTITIES_CONTROLLER}/${id}`)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

module.exports = {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  getEntities,
  getAttribute,
  updateAttribute,
};
