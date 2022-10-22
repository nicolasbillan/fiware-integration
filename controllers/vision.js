const vision = require('../data/googleVision');

async function getTextFromImage(fileImage) {
  return vision.getTextFromImage(fileImage);
}

module.exports = {
  getTextFromImage,
};
