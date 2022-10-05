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

let token = '';

async function adminLogin() {
  return axios
    .post(
      `${KEYROCK_API_URL}${KEYROCK.TOKENS_CONTROLLER}`,
      KEYROCK_ADMIN_USER_DATA
    )
    .then((res) => {
      token = res.headers[KEYROCK.TOKEN_RESPONSE_HEADER];
      return token;
    })
    .catch((e) => handleException(e));
}

async function getToken(username, password) {
  return axios
    .post(`${KEYROCK_API_URL}${KEYROCK_TOKENS_CONTROLLER}`, {
      name: username,
      password: password,
    })
    .then((res) => {
      /* TODO: store token in app lifetime */
      token = res.headers[KEYROCK.TOKEN_RESPONSE_HEADER];
      console.log('Headers: ', JSON.stringify(token));
      console.log('Response: ', res.data);
      return { ...res.data.token, value: token };
    })
    .catch((e) => handleException(e));
}

async function validateToken(token) {
  return axios
    .post(`${KEYROCK_API_URL}${KEYROCK_TOKENS_CONTROLLER}`, { token: token })
    .then((res) => {
      /* TODO: store token in app lifetime */
      token = res.headers[KEYROCK.TOKEN_RESPONSE_HEADER];
      return { ...res.data.token, value: token };
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
      let body = {
        user: {
          username: user.email,
          email: user.email,
          password: user.password,
        },
      };

      let config = { headers: {} };
      config.headers[KEYROCK.TOKEN_REQUEST_HEADER] = token;

      return axios.post(
        `${KEYROCK_API_URL}${KEYROCK.USERS_CONTROLLER}`,
        body,
        config
      );
    })
    .catch((e) => handleException(e));
}

function createUserPost(token) {
  let config = {
    headers: {
      'X-Auth-token': token,
    },
  };

  axios
    .post(
      `${KEYROCK_API_URL}${KEYROCK_USERS_CONTROLLER}`,
      KEYROCK_MOCK_USER_CREATE,
      config
    )
    .then((res) => {
      console.log(`User created`);
      console.log(`statusCode: ${res.status}`);
      console.log('Response: ', res.data);
    })
    .catch((e) => console.log(e));
}

module.exports = { getToken, validateToken, getUsers, createUser };
