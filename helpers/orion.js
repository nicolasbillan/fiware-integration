const { render } = require("jade");
const axios = require("axios").default;

const ORION_LOCAL_API_URL = "http://localhost:1026/v2/";
const ORION_ENTITIES_CONTROLLER = 'entities'
const ORION_ATTRIBUTES_CONTROLLER = 'attrs'

const EXPENSE_MOCK_DATA  = {
    title: 'Papitas',
    currency: 'ARS',
    amount: 200,
    category: 'Comida',
    paymentMethod: 'Cash',
    date: '2022-09-24',
    tags: [],
    location: {
        lat: -34.501866976757505,
        long: -58.495183525370386
    },
    image: []
}

const TRAVEL_MOCK_DATA = {
    id: 'Travel1',
    type: 'Travel',
    title: 'Mi Viaje',
    startDate: '2022-09-24',
    endDate: '2022-09-30',
    budget: 1500.00,
    expenses: [
        EXPENSE_MOCK_DATA
    ]
}

function generateId()
{
    //TODO: how to generate unique ids?
    return 1;
}

async function storeTravel(travel)
{
    travel = adaptTravel(travel);

    travel = {
        id: "Travel" + generateId(),
        type: "Travel",
        ...travel              
    }

    console.log(JSON.stringify(travel));

    return axios.post(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}`, travel)
    .then(res => {
        console.log(`statusCode: ${res.status}`);
        return res.data;
    })
    .catch(e => {
        console.log(e);
        return e;
    });
}

function updateTravel(id, attributes)
{
    axios.put(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}`, attributes)
    .then(res => {
        console.log(`statusCode: ${res.status}`);        
      })
    .catch(e => console.log(e))
}

async function storeExpense(travelId, expense)
{
    let expenses = await getExpensesFromTravel(travelId);

    expense = adaptExpense(expense)
    
    expense = {
        id: "Expense" + expenses.value.length,
        type: "Expense",
        ...expense        
    }

    expenses.value.push(expense);

    await axios.put(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${travelId}/${ORION_ATTRIBUTES_CONTROLLER}/expenses`, expenses)
    .then(res => { console.log(`statusCode: ${res.status}`); })
    .catch(e => console.log(e))
}

async function updateExpense(travelId, expenseId, attributes)
{
    //TODO:
    /* fetch all */
    /* change matching expense */
    /* update expenses attribute in travel */

    axios.put(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${travelId}/${ORION_ATTRIBUTES_CONTROLLER}`, attributes)
    .then(res => {
        console.log(`statusCode: ${res.status}`);        
      })
    .catch(e => console.log(e))
}

async function removeExpense(travelId, expenseId)
{
    let expenses = await getExpensesFromTravel(travelId);
    
    expenses.value = expenses.value.filter(v => v.id != expenseId);

    let result = await axios.put(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${travelId}/${ORION_ATTRIBUTES_CONTROLLER}/expenses`, expenses)
                .then(res => { console.log(`statusCode: ${res.status}`); })
                .catch(e => { throw { code: e.response.status, message: e.response.statusText } });

    // console.log(result);        
}

async function getExpense(travelId, expenseId)
{
    let expenses = await getExpensesFromTravel(travelId);
    
    let result = expenses.value.find(v => v.id == expenseId);

    if(result)
    {
        return result;
    }

    throw { code: 404, message: "Expense Not Found"} 
}

async function getTravel(id)
{
    return axios.get(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}`)
    .then(res => { return res.data; })
    .catch(e => { throw { code: e.response.status, message: e.response.message } });
}

async function getTravels()
{
    return axios.get(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}?type=Travel`)
    .then(res => {
        console.log(res.data);
        return res.data;
      })
    .catch(e => console.log(e))
}

async function getExpensesFromTravel(id)
{
    return getAttributeValue(id, 'expenses');
}

async function getAttributeValue(id, attrName)
{
    let result = await axios.get(`${ORION_LOCAL_API_URL}${ORION_ENTITIES_CONTROLLER}/${id}/${ORION_ATTRIBUTES_CONTROLLER}/${attrName}`)
        .then(res => { return res.data; })  
        .catch(e => { throw { code: e.response.status, message: e.response.statusText } });

    return result;
}

function adaptTravel(travel)
{
    return travel = {
        startDate: {
            type: "Datetime",
            value: travel.startDate
        },
        endDate: {
            type: "Datetime",
            value: travel.endDate
        },
        title: {
            type: "Text",
            value: travel.title
        },
        budget: {
            type: "Float",
            value: travel.budget
        },
    }
}

function convertTravel(travel)
{
    let converted = {};

    if (travel.startDate)
    {
        converted.startDate = {  
            type: "Datetime",
            value: travel.startDate
        }
    }

    return converted;
}

function adaptExpense(expense)
{
    return expense = {
        title: {
            type: "Text",
            value: expense.title
        },        
        amount: {
            type: "Float",
            value: expense.amount
        },
        date: {
            type: "Datetime",
            value: expense.date
        },
        location: {
            type: "geo:point",
            value: `${expense.location.lat}, ${expense.location.long}`
        },

        currency: {
            type: "Text", //TODO check type
            value: expense.currency
        },
        category: {
            type: "Text", //TODO check type
            value: expense.category
        },
        paymentMethod: {
            type: "Text", //TODO check type
            value: expense.paymentMethod
        },
        //tags: [],        
    }
}

module.exports = { getTravels, getTravel, storeTravel, updateTravel, storeExpense, getExpense, updateExpense, removeExpense }