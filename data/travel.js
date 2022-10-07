const crypto = require('crypto');
const Orion = require('../helpers/orion');
const Parser = require('../parsers/orion');
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

function generateId() {
  return crypto.randomUUID();
}

//TRAVELS

async function getTravel(id) {
  return Parser.parseTravel(await Orion.getEntity(id));
}

async function getTravels() {
  let travels = await Orion.getEntities({ type: ORION.ENTITY_TYPE_TRAVEL });
  return travels.map((t) => Parser.parseTravel(t));
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
    id: ORION.ENTITY_TYPE_EXPENSE + expenses.length,
    type: ORION.ENTITY_TYPE_EXPENSE,
    ...expense,
  };

  expenses.value.push(expense);

  return await Orion.updateAttribute(
    travelId,
    ORION.ATTRIBUTE_NAME_EXPENSES,
    expenses
  );
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

  expenses = expenses
    .filter((v) => v.id != expenseId)
    .map((e) => adaptExpense(e));

  return await Orion.updateAttribute(
    travelId,
    ORION.ATTRIBUTE_NAME_EXPENSES,
    expenses
  );
}

async function getExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  let result = expenses.value.find((v) => v.id == expenseId);

  if (result) {
    return parseExpense(result);
  }

  throw { code: 404, message: 'Expense Not Found' };
}

async function getExpenses(travelId) {
  //TODO: filter
  return (await getExpensesFromTravel(travelId)).value.map((e) =>
    Parser.parseExpense(e)
  );
}

async function getExpensesFromTravel(id) {
  //TODO: filter expenses in-memory
  let expenses = await Orion.getAttribute(id, ORION.ATTRIBUTE_NAME_EXPENSES);
  return expenses;
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
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.title,
    },
    amount: {
      type: ORION.ATTRIBUTE_TYPE_NUMBER,
      value: expense.amount,
    },
    date: {
      type: ORION.ATTRIBUTE_TYPE_DATE,
      value: expense.date,
    },
    location: {
      type: 'geo:point',
      value: `${expense.location.lat}, ${expense.location.long}`,
    },
    currency: {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.currency,
    },
    category: {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.category,
    },
    paymentMethod: {
      type: ORION.ATTRIBUTE_TYPE_STRING,
      value: expense.paymentMethod,
    },
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
