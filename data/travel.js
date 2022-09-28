const axios = require('axios').default;
const crypto = require('crypto');

const ORION_LOCAL_API_URL = 'http://localhost:1026/v2/';
const ORION_ENTITIES_CONTROLLER = 'entities';
const ORION_ATTRIBUTES_CONTROLLER = 'attrs';

const EXPENSE_MOCK_DATA = {
  title: 'Papitas',
  currency: 'ARS',
  amount: 200,
  category: 'Comida',
  paymentMethod: 'Cash',
  date: '2022-09-24',
  tags: [],
  location: {
    lat: -34.501866976757505,
    long: -58.495183525370386,
  },
  image: [],
};

const TRAVEL_MOCK_DATA = {
  id: 'Travel1',
  type: 'Travel',
  title: 'Mi Viaje',
  startDate: '2022-09-24',
  endDate: '2022-09-30',
  budget: 1500.0,
  expenses: [EXPENSE_MOCK_DATA],
};

function generateId() {
  return crypto.randomUUID();
}

async function storeTravel(travel) {
  return axios
    .post(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}`,
      createTravel(travel)
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.statusText };
    });
}

async function updateTravel(id, attributes) {
  return axios
    .post(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}`,
      formatAttributes(attributes)
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.statusText };
    });
}

async function deleteTravel(id) {
  return axios
    .delete(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}`)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.statusText };
    });
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

  await axios
    .put(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${travelId}/${ORION_ATTRIBUTES_CONTROLLER}/expenses`,
      expenses
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => console.log(e));
}

async function updateExpense(travelId, expenseId, attributes) {
  //TODO:
  /* fetch all */
  /* change matching expense */
  /* update expenses attribute in travel */

  axios
    .put(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${travelId}/${ORION_ATTRIBUTES_CONTROLLER}`,
      attributes
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => console.log(e));
}

async function removeExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  expenses.value = expenses.value.filter((v) => v.id != expenseId);

  await axios
    .put(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${travelId}/${ORION_ATTRIBUTES_CONTROLLER}/expenses`,
      expenses
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.statusText };
    });
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

async function getTravel(id) {
  return axios
    .get(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.message };
    });
}

async function getTravels() {
  //TODO: filters
  return axios
    .get(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}?type=Travel`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.message };
    });
}

async function getExpensesFromTravel(id) {
  return getAttributeValue(id, 'expenses');
}

async function getAttributeValue(id, attrName) {
  let result = await axios
    .get(
      `${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}/${attrName}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw { code: e.response.status, message: e.response.statusText };
    });

  return result;
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
