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

function parseLocation(location) {
  let parts = location.split(',');
  return {
    lat: parts[0].trim(' '),
    long: parts[1].trim(' '),
  };
}

module.exports = {
  parseTravel,
  parseExpense,
};
