const Vision = require('@google-cloud/vision');
const { DIR } = require('../config');

//Connect with the GCP client
const client = new Vision.ImageAnnotatorClient({
  keyFilename: DIR + '/service_account.json',
});

//Process the image and return the value
async function getTextFromImage(image) {
  console.log(image);
  const [result] = await client.textDetection(image);
  const detections = result.textAnnotations;
  console.log(detections);
  let number = getTotal(detections[0]['description']);
  return number;
}

//Calculate the value
function getTotal(totalText) {
  const words = totalText.split('\n');
  const matches = words.filter((s) => s.includes('TOTAL'));
  let numb = matches[0].match(/[+-]?\d+(\.\d+)?/g);
  return parseFloat(numb[0]);
}

module.exports = { getTextFromImage };
