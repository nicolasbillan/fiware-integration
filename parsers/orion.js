const { ORION } = require('../constants/orion');
const crypto = require('crypto');

function generateId() {
  return crypto.randomUUID();
}

//Turns Orion API format into ours
function parseTravel(travel) {
  return {
    id: travel.id,
    title: travel.title.value,
    budget: travel.budget.value,
    startDate: travel.startDate.value,
    endDate: travel.endDate.value,
    expenses: travel.expenses.value.map((e) => parseExpense(e)),
  };
}

//Turns our API format into Orion (only existing properties)
function formatTravel(travel) {
  let formatted = {};

  if (travel.id) {
    formatted.id = travel.id;
  }

  if (travel.user) {
    formatted.user = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: travel.user,
    };
  }

  if (travel.type) {
    formatted.type = travel.type;
  }

  if (travel.title) {
    formatted.title = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: travel.title,
    };
  }

  if (travel.budget || travel.budget === 0) {
    formatted.budget = {
      type: ORION.ATTRIBUTE_TYPE_NUMBER,
      value: travel.budget,
    };
  }

  if (travel.startDate) {
    formatted.startDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: travel.startDate,
    };
  }

  if (travel.endDate) {
    formatted.endDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: travel.endDate,
    };
  }

  if (travel.expenses) {
    formatted.expenses = {
      type: ORION.ATTRIBUTE_TYPE_ARRAY,
      value: travel.expenses,
    };
  }

  if (travel.creationDate) {
    formatted.creationDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: travel.creationDate,
    };
  }

  return formatted;
}

//Creates empty ORION style travel with all properties
function createTravel() {
  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_TRAVEL,
    user: ORION.DEFAULT_STRING,
    title: ORION.DEFAULT_STRING,
    budget: 0,
    startDate: ORION.DEFAULT_DATE,
    endDate: ORION.DEFAULT_DATE,
    expenses: [],
    //creationDate: randomDate(new Date(2012, 0, 1), new Date()).toISOString().split('T')[0]
    creationDate: new Date().toISOString().split('T')[0],
  };
}

//Turns Orion API format into ours
function parseExpense(expense) {
  return {
    id: expense.id,
    title: expense.title.value,
    amount: expense.amount.value,
    date: expense.date.value,
    location: parseLocation(expense.location.value),
    currency: expense.currency.value,
    category: expense.category.value,
    paymentMethod: expense.paymentMethod.value,
  };
}

//Turns our API format into Orion (only existing properties)p
function formatExpense(expense) {
  let formatted = {};

  if (expense.id) {
    formatted.id = expense.id;
  }

  if (expense.type) {
    formatted.type = expense.type;
  }

  if (expense.title) {
    formatted.title = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.title,
    };
  }

  if (expense.amount || expense.amount === 0) {
    formatted.amount = {
      type: ORION.ATTRIBUTE_TYPE_NUMBER,
      value: expense.amount,
    };
  }

  if (expense.date) {
    formatted.date = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: expense.date,
    };
  }

  if (expense.location) {
    formatted.location = {
      type: ORION.ATTRIBUTE_TYPE_GEOLOCATION,
      value: `${expense.location.lat}, ${expense.location.long}`,
    };
  }

  if (expense.currency) {
    formatted.currency = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.currency,
    };
  }

  if (expense.category) {
    formatted.category = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.category,
    };
  }

  if (expense.paymentMethod) {
    formatted.paymentMethod = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.paymentMethod,
    };
  }

  if (expense.creationDate) {
    formatted.creationDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: expense.creationDate,
    };
  }

  return formatted;
}

//Creates empty expense with all properties
function createExpense() {
  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_EXPENSE,
    title: ORION.DEFAULT_STRING,
    amount: 0,
    date: ORION.DEFAULT_DATE,
    location: {
      lat: 0,
      long: 0,
    },
    currency: ORION.DEFAULT_STRING,
    category: ORION.DEFAULT_STRING,
    paymentMethod: ORION.DEFAULT_STRING,
    creationDate: new Date().toISOString().split('T')[0],
  };
}

function formatUser(user) {
  let formatted = {};

  if (user.id) {
    formatted.id = user.id;
  }

  if (user.type) {
    formatted.type = user.type;
  }

  if (user.email) {
    formatted.email = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: user.email,
    };
  }

  if (user.creationDate) {
    formatted.creationDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: user.creationDate,
    };
  }

  return formatted;
}

function createUser() {
  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_USER,
    email: ORION.DEFAULT_STRING,
    creationDate: new Date().toISOString().split('T')[0],
  };
}

function parseLocation(location) {
  let parts = location.split(',');
  return {
    lat: parts[0].trim(' '),
    long: parts[1].trim(' '),
  };
}

module.exports = {
  parseTravel,
  formatTravel,
  createTravel,
  parseExpense,
  formatExpense,
  createExpense,
  formatUser,
  createUser,
};
