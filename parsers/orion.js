const { ORION } = require('../constants/orion');

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

function formatTravel(travel) {
  let formatted = {};

  if (travel.title) {
    formatted.title = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: travel.title,
    };
  }

  if (travel.budget) {
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

  return formatted;
}

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

  if (expense.amount) {
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

  return formatted;
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

  return formatted;
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
  parseExpense,
  formatExpense,
  formatUser,
};
