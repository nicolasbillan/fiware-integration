const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, EMAIL_FROM, DIR } = require('../config');

let fs = require('fs');

function message(email, img) {
  //get dir of image
  const image_dir = DIR + '/images/' + img;
  //Convert Image to Base64
  let imageAsBase64 = fs.readFileSync(image_dir, 'base64');
  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Orion Travel - Spending',
    text: 'Travel with your Friends',
    html: 'The ticket <strong>' + img + '</strong>  is attached to the email.',
    attachments: [
      {
        content: imageAsBase64,
        filename: img,
        type: 'image/jpeg',
        disposition: 'attachment',
      },
    ],
  };
  console.log(msg);
  return msg;
}

//Send the email to the recipient info.email
async function sendEmail(info) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  await sgMail
    .send(message(info.email, info.image))
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
      message = 'Email was sended';
    })
    .catch((error) => {
      console.error(error);
      message = 'Ops! Error while sending mail';
    });
  return { message: message };
}

module.exports = { sendEmail };
