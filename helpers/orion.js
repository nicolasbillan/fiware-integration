const axios = require('axios').default;
const crypto = require('crypto');
const { MESSAGES } = require('../constants/messages');

const ORION_LOCAL_API_URL = 'http://localhost:1026/v2/';

const ORION_ENTITIES_CONTROLLER = 'entities';
const ORION_ATTRIBUTES_CONTROLLER = 'attrs';

// ORION

function handleException(e) {
  throw {
    code: e.response?.status ?? 500,
    message: e.response?.statusText ?? MESSAGES.CONTEXT_BROKER_CONNECTION_ERROR,
  };
}

async function getEntity(id) {
  return axios
    .get(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => handleException(e));
}

async function getAttribute(id, attribute) {
  return axios
    .get(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}/${attribute}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => handleException(e));
}

async function getEntities(parameters) {
  return axios
    .get(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}?type=${parameters.type}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => handleException(e));
}

async function createEntity(body) {
  return axios
    .post(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}`, body)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

async function updateEntity(id, body) {
  return axios
    .post(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}`,
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
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}/${attribute}`,
      body
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

async function deleteEntity(id) {
  return axios
    .delete(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}`)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => handleException(e));
}

function generateId() {
  return crypto.randomUUID();
}

//TRAVELS

async function getTravel(id) {
  return await getEntity(id);
}

async function getTravels() {
  return await getEntities({ type: 'Travel' });
}

async function storeTravel(travel) {
  await createEntity(createTravel(travel));
}

async function updateTravel(id, attributes) {
  await updateEntity(id, formatAttributes(attributes));
}

async function deleteTravel(id) {
  await deleteEntity(id);
}

async function storeExpense(travelId, expense) {
  let expenses = await getExpensesFromTravel(travelId);

  expense = adaptExpense(expense);

  expense = {
    id: 'Expense' + expenses.value.length,
    type: 'Expense',
    ...expense,
  };

  expenses.value.push(expense);

  return await updateAttribute(travelId, 'expenses', expenses);
}

async function updateExpense(travelId, expenseId, attributes) {
  let expenses = await getExpensesFromTravel(travelId);

  let expense = expenses.value.find((e) => e.id == expenseId);

  if (!expense) {
    throw { code: 404, message: MESSAGES.EXPENSE_NOT_FOUND };
  }

  //TODO:
  //compose new expense with old + new attributes
  //swap expenses from collection

  return await updateAttribute(travelId, 'expenses', expenses);
}

async function removeExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  expenses.value = expenses.value.filter((v) => v.id != expenseId);

  return await updateAttribute(travelId, 'expenses', expenses);
}

async function getExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  let result = expenses.value.find((v) => v.id == expenseId);

  if (result) {
    return result;
  }

  throw { code: 404, message: 'Expense Not Found' };
}

async function getExpenses(travelId) {
  //TODO: filter
  return await getExpensesFromTravel(travelId);
}

async function getExpensesFromTravel(id) {
  //TODO: filter expenses in-memory
  return getAttribute(id, 'expenses');
}

function createTravel(attributes) {
  attributes.expenses = [];

  return {
    id: generateId(),
    type: 'Travel',
    ...formatAttributes(attributes),
  };
}

/// Parse travel dto into orion's (context broker) accepted format and also purges unwanted attributes
function formatAttributes(travel) {
  let converted = {};

  if (travel.title) {
    converted.title = {
      type: 'Text',
      value: travel.title,
    };
  }

  if (travel.budget) {
    converted.budget = {
      type: 'Float',
      value: travel.budget,
    };
  }

  if (travel.startDate) {
    converted.startDate = {
      type: 'Datetime',
      value: travel.startDate,
    };
  }

  if (travel.endDate) {
    converted.endDate = {
      type: 'Datetime',
      value: travel.endDate,
    };
  }

  if (travel.expenses) {
    converted.expenses = {
      type: 'StructuredValue',
      value: travel.expenses,
    };
  }

  return converted;
}

function adaptExpense(expense) {
  return (expense = {
    title: {
      type: 'Text',
      value: expense.title,
    },
    amount: {
      type: 'Float',
      value: expense.amount,
    },
    date: {
      type: 'Datetime',
      value: expense.date,
    },
    location: {
      type: 'geo:point',
      value: `${expense.location.lat}, ${expense.location.long}`,
    },
    currency: {
      type: 'Text', //TODO check type
      value: expense.currency,
    },
    category: {
      type: 'Text', //TODO check type
      value: expense.category,
    },
    paymentMethod: {
      type: 'Text', //TODO check type
      value: expense.paymentMethod,
    },
    //tags: [],
  });
}

module.exports = {
  getTravels,
  getTravel,
  storeTravel,
  updateTravel,
  deleteTravel,
  storeExpense,
  getExpense,
  getExpenses,
  updateExpense,
  removeExpense,
};
