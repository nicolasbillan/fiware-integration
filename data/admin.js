const groupBy = require('core-js');
const Orion = require('../helpers/orion');
const Parser = require('../parsers/orion');
const { MESSAGES } = require('../constants/messages');
const { ORION } = require('../constants/orion');

async function getTravelsByDay() {
  let travels = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_TRAVEL,
  });

  let travelsByDay = travels
    .filter((t) => t.creationDate)
    .groupBy((t) => {
      const dateParts = t.creationDate.value.split('-');
      return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    });

  return Object.keys(travelsByDay)
    .sort()
    .map((key) => {
      return { day: key, travelCount: travelsByDay[key].length };
    });
}

async function getTravelsByMonth() {
  let travels = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_TRAVEL,
  });

  let travelsByMonth = travels
    .filter((t) => t.creationDate)
    .groupBy((t) => {
      const dateParts = t.creationDate.value.split('-');
      return `${dateParts[0]}-${dateParts[1]}`;
    });

  return Object.keys(travelsByMonth)
    .sort()
    .map((key) => {
      return { month: key, travelCount: travelsByMonth[key].length };
    });
}

async function getTravelsByYear() {
  let travels = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_TRAVEL,
  });

  let travelsByYear = travels
    .filter((t) => t.creationDate)
    .groupBy((t) => {
      const dateParts = t.creationDate.value.split('-');
      return dateParts[0];
    });

  return Object.keys(travelsByYear)
    .sort()
    .map((key) => {
      return { year: key, travelCount: travelsByYear[key].length };
    });
}

async function getTravelsSummary(period) {
  switch (period) {
    case 'day':
      return await getTravelsByDay();

    case 'month':
      return await getTravelsByMonth();

    case 'year':
      return await getTravelsByYear();

    default:
      throw { code: 400, message: MESSAGES.INVALID_PERIOD };
  }
}

async function getUsersByDay() {
  let users = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_USER,
  });

  let registersByDay = users
    .filter((u) => u.creationDate)
    .groupBy((u) => {
      const dateParts = u.creationDate.value.split('-');
      return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    });

  return Object.keys(registersByDay)
    .sort()
    .map((key) => {
      return { day: key, usersCount: registersByDay[key].length };
    });
}

async function getUsersByMonth() {
  let users = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_USER,
  });

  let registersByMonth = users
    .filter((u) => u.creationDate)
    .groupBy((u) => {
      const dateParts = u.creationDate.value.split('-');
      return `${dateParts[0]}-${dateParts[1]}`;
    });

  return Object.keys(registersByMonth)
    .sort()
    .map((key) => {
      return { month: key, userCount: registersByMonth[key].length };
    });
}

async function getUsersByYear() {
  let users = await Orion.getEntities({
    type: ORION.ENTITY_TYPE_USER,
  });

  let registersByYear = users
    .filter((u) => u.creationDate)
    .groupBy((t) => {
      const dateParts = t.creationDate.value.split('-');
      return dateParts[0];
    });

  return Object.keys(registersByYear)
    .sort()
    .map((key) => {
      return { year: key, userCount: registersByYear[key].length };
    });
}

async function getUsersSummary(period) {
  switch (period) {
    case 'day':
      return await getUsersByDay();

    case 'month':
      return await getUsersByMonth();

    case 'year':
      return await getUsersByYear();

    default:
      throw { code: 400, message: MESSAGES.INVALID_PERIOD };
  }
}

module.exports = {
  getTravelsSummary,
  getUsersSummary,
};
