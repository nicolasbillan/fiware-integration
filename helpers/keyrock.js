const axios = require("axios").default;

const KEYROCK_API_URL = "http://localhost:3000/v1/";
const KEYROCK_TOKENS_CONTROLLER = 'auth/tokens'
const KEYROCK_USERS_CONTROLLER = 'users'

const KEYROCK_ADMIN_USER_DATA = {
    "name": "admin@test.com",
    "password": "1234"
}

const KEYROCK_MOCK_USER_CREATE = 
{
  "user": {
    "username": "nico",
    "email": "nico@test.com",
    "password": "passw0rd"
  }
}

let token = '';

async function getToken(username, password)
{
    return axios.post(`${KEYROCK_API_URL}${KEYROCK_TOKENS_CONTROLLER}`, { "name": username, "password": password })
    .then(res => {
        /* TODO: store token in app lifetime */
        token = res.headers['x-subject-token'];
        console.log('Headers: ', JSON.stringify(token));
        console.log('Response: ', res.data);
        return { ...res.data.token, value: token };
      })
}

async function validateToken(token)
{
    return axios.post(`${KEYROCK_API_URL}${KEYROCK_TOKENS_CONTROLLER}`, { "token": token })
    .then(res => {
        /* TODO: store token in app lifetime */
        token = res.headers['x-subject-token'];
        console.log('Headers: ', JSON.stringify(token));
        console.log('Response: ', res.data);
        return { ...res.data.token, value: token };
      })
}

function getUsers() {
    getToken()
        .then(res => 
          {
            let config = { headers : { "X-Auth-token" : token } };

            return axios.get(`${KEYROCK_LOCAL_API_URL}${KEYROCK_USERS_CONTROLLER}`, config);
          })
        .then(res => {
            console.log(`statusCode: ${res.status}`);            
            console.log('Response: ', res.data);
          })
        .catch(e => console.log(e))
}

function createUser(user)
{
    axios.post(`${KEYROCK_LOCAL_API_URL}${KEYROCK_TOKENS_CONTROLLER}`, KEYROCK_ADMIN_USER_DATA)
        .then(res => {
            //console.log(`statusCode: ${res.status}`);
            token = res.headers['x-subject-token'];
            createUserPost();
          })
        .catch(e => console.log(e.status))
}

function createUserPost()
{
    let config = {
        headers : {
            "X-Auth-token" : token
        }
    };   

    axios.post(`${KEYROCK_LOCAL_API_URL}${KEYROCK_USERS_CONTROLLER}`, KEYROCK_MOCK_USER_CREATE, config)
        .then(res => {
            console.log(`User created`);
            console.log(`statusCode: ${res.status}`);
            console.log('Response: ', res.data);
          })
        .catch(e => console.log(e))
}

module.exports = { getToken, validateToken, getUsers, createUser }