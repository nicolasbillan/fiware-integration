const crypto = require('crypto');
const Orion = require('../helpers/orion');
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

function generateId() {
  return crypto.randomUUID();
}

//TRAVELS

async function getTravel(id) {
  return await Orion.getEntity(id);
}

async function getTravels() {
  return await Orion.getEntities({ type: ORION.ENTITY_TYPE_TRAVEL });
}

async function storeTravel(travel) {
  await Orion.createEntity(createTravel(travel));
}

async function updateTravel(id, attributes) {
  await Orion.updateEntity(id, formatAttributes(attributes));
}

async function deleteTravel(id) {
  await Orion.deleteEntity(id);
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

  return await Orion.updateAttribute(travelId, 'expenses', expenses);
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

  return await Orion.updateAttribute(travelId, 'expenses', expenses);
}

async function removeExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  expenses.value = expenses.value.filter((v) => v.id != expenseId);

  return await Orion.updateAttribute(travelId, 'expenses', expenses);
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
  return Orion.getAttribute(id, 'expenses');
}

function createTravel(attributes) {
  attributes.expenses = [];

  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_TRAVEL,
    ...formatAttributes(attributes),
  };
}

/// Parse travel dto into orion's (context broker) accepted format and also purges unwanted attributes
function formatAttributes(travel) {
  let converted = {};

  if (travel.title) {
    converted.title = {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: travel.title,
    };
  }

  if (travel.budget) {
    converted.budget = {
      type: ORION.ATTRIBUTE_TYPE_NUMBER,
      value: travel.budget,
    };
  }

  if (travel.startDate) {
    converted.startDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: travel.startDate,
    };
  }

  if (travel.endDate) {
    converted.endDate = {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: travel.endDate,
    };
  }

  if (travel.expenses) {
    converted.expenses = {
      type: ORION.ATTRIBUTE_TYPE_ARRAY,
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
