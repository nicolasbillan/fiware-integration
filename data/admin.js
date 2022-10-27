const groupBy = require('core-js');
const Orion = require('../helpers/orion');
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

//HELPERS
function getYearFromCreationDate(entity) {
  const dateParts = entity.creationDate.value.split('-');
  return dateParts[0];
}

function getMonthFromCreationDate(entity) {
  const dateParts = entity.creationDate.value.split('-');
  return `${dateParts[0]}-${dateParts[1]}`;
}

function getDayFromCreationDate(entity) {
  return entity.creationDate.value;
}

function getPeriodFromCreationDate(period, entity) {
  switch (period) {
    case 'day':
      return getDayFromCreationDate(entity);

    case 'month':
      return getMonthFromCreationDate(entity);

    case 'year':
      return getYearFromCreationDate(entity);

    default:
      throw { code: 400, message: MESSAGES.INVALID_PERIOD };
  }
}

//TRAVELS
async function getTravelsSummary(period) {
  let travels = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_TRAVEL,
  });

  let travelsByYear = travels
    .filter((t) => t.creationDate)
    .groupBy((t) => getPeriodFromCreationDate(period, t));

  return Object.keys(travelsByYear)
    .sort()
    .map((key) => {
      return { [period]: key, count: travelsByYear[key].length };
    });
}

//USERS
async function getUsersSummary(period) {
  let users = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_USER,
  });

  let registers = users
    .filter((u) => u.creationDate)
    .groupBy((u) => getPeriodFromCreationDate(period, u));

  return Object.keys(registers)
    .sort()
    .map((key) => {
      return { [period]: key, count: registers[key].length };
    });
}

//EXPENSES
async function getExpenses() {
  let travels = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_TRAVEL,
    attribute: ORION.ATTRIBUTE_NAME_EXPENSES,
  });

  return travels.reduce(
    (previous, current) => previous.concat(current.expenses.value),
    []
  );
}

async function getExpensesByCategory() {
  let expenses = (await getExpenses())
    .filter((e) => e.category)
    .groupBy((e) => e.category.value);

  return Object.keys(expenses)
    .sort()
    .map((key) => {
      return { category: key, count: expenses[key].length };
    });
}

async function getExpensesByPaymentMethod() {
  let expenses = (await getExpenses())
    .filter((e) => e.paymentMethod)
    .groupBy((e) => e.paymentMethod.value);

  return Object.keys(expenses)
    .sort()
    .map((key) => {
      return { paymentMethod: key, count: expenses[key].length };
    });
}

async function getExpensesByPeriod(period) {
  let expenses = (await getExpenses())
    .filter((e) => e.creationDate)
    .groupBy((e) => getPeriodFromCreationDate(period, e));

  return Object.keys(expenses)
    .sort()
    .map((key) => {
      return { [period]: key, count: expenses[key].length };
    });
}

async function getExpensesSummary(group, period) {
  switch (group) {
    case 'date':
      return await getExpensesByPeriod(period);

    case 'category':
      return await getExpensesByCategory();

    case 'paymentMethod':
      return await getExpensesByPaymentMethod();

    default:
      throw { code: 400, message: MESSAGES.INVALID_GROUP };
  }
}

module.exports = {
  getTravelsSummary,
  getUsersSummary,
  getExpensesSummary,
};
