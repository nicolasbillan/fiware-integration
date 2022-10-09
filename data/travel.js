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
  //TODO: filter by user
  let travels = await Orion.getEntities({ type: ORION.ENTITY_TYPE_TRAVEL });
  return travels.map((t) => Parser.parseTravel(t));
}

async function storeTravel(travel) {
  await Orion.createEntity(createTravel(travel));
}

async function updateTravel(id, attributes) {
  await Orion.updateEntity(id, Parser.formatTravel(attributes));
}

async function deleteTravel(id) {
  await Orion.deleteEntity(id);
}

function createTravel(attributes) {
  attributes.expenses = [];

  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_TRAVEL,
    ...Parser.formatTravel(attributes),
  };
}

//EXPENSES

async function storeExpense(travelId, expense) {
  let expenses = await getExpensesFromTravel(travelId);

  expenses.value.push(createExpense(expense));

  return await Orion.updateAttribute(
    travelId,
    ORION.ATTRIBUTE_NAME_EXPENSES,
    expenses
  );
}

async function removeExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  /* Find expense */
  let expense = expenses.value.find((e) => e.id == expenseId);

  if (!expense) {
    throw { code: 404, message: MESSAGES.EXPENSE_NOT_FOUND };
  }

  expenses.value = expenses.value.filter((v) => v.id != expenseId);

  return await Orion.updateAttribute(
    travelId,
    ORION.ATTRIBUTE_NAME_EXPENSES,
    expenses
  );
}

async function updateExpense(travelId, expenseId, attributes) {
  let expenses = await getExpensesFromTravel(travelId);

  /* Find expense */
  let expense = expenses.value.find((e) => e.id == expenseId);

  if (!expense) {
    throw { code: 404, message: MESSAGES.EXPENSE_NOT_FOUND };
  }

  /* Remove old expense */
  expenses.value = expenses.value.filter((v) => v.id != expenseId);

  /* Insert new expense */
  expenses.value.push(Parser.formatExpense(mergeExpense(expense, attributes)));

  return await Orion.updateAttribute(
    travelId,
    ORION.ATTRIBUTE_NAME_EXPENSES,
    expenses
  );
}

async function getExpense(travelId, expenseId) {
  let expenses = await getExpensesFromTravel(travelId);

  let expense = expenses.value.find((v) => v.id == expenseId);

  if (!expense) {
    throw { code: 404, message: MESSAGES.EXPENSE_NOT_FOUND };
  }

  return Parser.parseExpense(expense);
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

function createExpense(attributes) {
  return {
    id: generateId(),
    type: ORION.ENTITY_TYPE_EXPENSE,
    ...Parser.formatExpense(attributes),
  };
}

function mergeExpense(oldAttributes, newAttributes) {
  return {
    id: oldAttributes.id,
    type: oldAttributes.type,
    title: !newAttributes.title
      ? oldAttributes.title.value
      : newAttributes.title,
    amount: !newAttributes.amount
      ? oldAttributes.amount.value
      : newAttributes.amount,
    date: !newAttributes.date ? oldAttributes.date.value : newAttributes.date,
    location: !newAttributes.location
      ? oldAttributes.location.value
      : newAttributes.location,
    currency: !newAttributes.currency
      ? oldAttributes.currency.value
      : newAttributes.currency,
    category: !newAttributes.category
      ? oldAttributes.category.value
      : newAttributes.category,
    paymentMethod: !newAttributes.paymentMethod
      ? oldAttributes.paymentMethod.value
      : newAttributes.paymentMethod,
  };
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
      type: ORION.ATTRIBUTE_TYPE_GEOLOCATION,
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
