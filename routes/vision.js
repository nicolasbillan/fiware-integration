var express = require('express');
const { DIR } = require('../config');
var router = express.Router();
const visionController = require('../controllers/vision');
const emailController = require('../controllers/sendgrid');

//Process image from url
router.post('/image', async function (req, res) {
  console.log('- Processing image from URL...');
  const response = await visionController.getTextFromImage(req.body.url);
  res.json(response);
});

//Process image from local file :id = image name
router.post('/image/:id', async function (req, res) {
  console.log('- Processing image from Camera...');
  const image = DIR + '/images/' + req.params.id + '.jpeg';
  const response = await visionController.getTextFromImage(image);
  res.json(response);
});

//Sending mail with ticket attached
router.post('/email', async function (req, res) {
  console.log('- Processing email...');
  const response = await emailController.sendEmail(req.body);
  res.json(response);
});

module.exports = router;
