const emailApi = require('../data/sendgrid');

async function sendEmail(info) {
  return emailApi.sendEmail(info);
}

module.exports = {
  sendEmail,
};
