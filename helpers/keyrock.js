const axios = require('axios').default;
const { MESSAGES } = require('../constants/messages');
const { KEYROCK } = require('../constants/keyrock');

const KEYROCK_API_URL = 'http://localhost:3000/v1/';

const KEYROCK_ADMIN_USER_DATA = {
  name: process.env.KEYROCK_ADMIN_USER,
  password: process.env.KEYROCK_ADMIN_PASSWORD,
};

const KEYROCK_MOCK_USER_CREATE = {
  user: {
    username: 'nico',
    email: 'nico@test.com',
    password: 'passw0rd',
  },
};

function handleException(e) {
  throw {
    code: e.response?.status ?? 500,
    message:
      e.response?.statusText ?? MESSAGES.IDENTITY_MANAGER_CONNECTION_ERROR,
  };
}

async function adminLogin() {
  return axios
    .post(
      `${KEYROCK_API_URL}${KEYROCK.TOKENS_CONTROLLER}`,
      KEYROCK_ADMIN_USER_DATA
    )
    .then((res) => {
      return res.headers[KEYROCK.TOKEN_RESPONSE_HEADER];
    })
    .catch((e) => handleException(e));
}

async function getToken(username, password) {
  return axios
    .post(`${KEYROCK_API_URL}${KEYROCK.TOKENS_CONTROLLER}`, {
      name: username,
      password: password,
    })
    .then((res) => {
      /* TODO: store token in app lifetime */
      return {
        ...res.data.token,
        value: res.headers[KEYROCK.TOKEN_RESPONSE_HEADER],
      };
    })
    .catch((e) => handleException(e));
}

async function validateToken(token) {
  return axios
    .post(`${KEYROCK_API_URL}${KEYROCK.TOKENS_CONTROLLER}`, { token: token })
    .then((res) => {
      /* TODO: store token in app lifetime */
      return {
        ...res.data.token,
        value: res.headers[KEYROCK.TOKEN_RESPONSE_HEADER],
      };
    })
    .catch((e) => handleException(e));
}

function getUsers() {
  getToken()
    .then((res) => {
      let headers = {};
      headers[KEYROCK.TOKEN_REQUEST_HEADER] = token;
      return axios.get(`${KEYROCK_API_URL}${KEYROCK_USERS_CONTROLLER}`, {
        headers,
      });
    })
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      console.log('Response: ', res.data);
    })
    .catch((e) => handleException(e));
}

async function createUser(user) {
  return await adminLogin()
    .then((res) => {
      let config = { headers: {} };
      config.headers[KEYROCK.TOKEN_REQUEST_HEADER] = res;

      return axios.post(
        `${KEYROCK_API_URL}${KEYROCK.USERS_CONTROLLER}`,
        formatUser(user),
        config
      );
    })
    .then((res) => {
      console.log(`User created`);
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

function formatUser(user) {
  return {
    user: {
      username: user.email,
      email: user.email,
      password: user.password,
    },
  };
}

module.exports = { getToken, validateToken, getUsers, createUser };
