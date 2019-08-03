/* eslint-disable no-console */
const aki = require('../index');
// start off the game, start does not have these properties due to the website.
const regions = ['en', 'en2', 'en3', 'en_object', 'en_animals',
  'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
  'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr'];

// example
const testGame = async (region) => {
  const startGame = await aki.start(region);
  const step = 0;
  if (startGame != null) {
    const answerId = 0;
    await aki.step(region, startGame.session, startGame.signature, answerId, step);
  }
};


// full game test
(async () => {
  const region = 'en';
  const startGame = await aki.start(region).catch(console.error);
  let answerId = 0;
  let currentStep = await aki.step(region, startGame.session, startGame.signature, answerId, 0);
  // WARNING DO NOT ACTUALLY DO THIS IN YOUR CODE
  // THIS WILL BLOCK THE THREAD. BAD BAD BAD!!!
  for (let i = 0; i < regions.length; i += 1) {
    const r = regions[i];
    try {
      await testGame(r);
      console.log(i + 1, 'test passed', r);
    } catch(error) {
      console.error(error);
      console.error(i + 1, 'TEST FAILED', r);
    }
  }


  // WARNING DO NOT ACTUALLY DO THIS IN YOUR CODE
  // THIS WILL BLOCK THE THREAD. BAD BAD BAD!!!
  while (currentStep.progress <= 85) {
    answerId = Math.floor(Math.random() * 2);
    currentStep = await aki.step(region, startGame.session, startGame.signature, answerId, currentStep.nextStep);
  }
  await aki.win(region, startGame.session, startGame.signature, currentStep.nextStep).catch(console.error);
  console.log('finished');
})();
