/* eslint-disable no-console */
const aki = require('../index');

const regions = ['en', 'en_object', 'en_animals',
  'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
  'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr'];

const testGame = async (region) => {
  const startGame = await aki.start(region);
  let answerId = 0;

  if (startGame == null) {
    console.error('Could not start a session.');
  }

  if (startGame != null) {
    let currentStep = await aki.step(region, startGame.session, startGame.signature, answerId, 0, startGame.frontAddr);

    currentStep = await aki.back(region, startGame.session, startGame.signature, answerId, currentStep.nextStep, startGame.frontAddr);

    while (currentStep.progress <= 50) {
      answerId = Math.floor(Math.random() * 2);
      currentStep = await aki.step(region, startGame.session, startGame.signature, answerId, currentStep.nextStep, startGame.frontAddr);
    }
    await aki.win(region, startGame.session, startGame.signature, currentStep.nextStep).catch(console.error);
    console.log('finished');
  }
};


// full game test
(async () => {
  for (let i = 0; i < regions.length; i += 1) {
    const r = regions[i];
    try {
      await testGame(r);
      console.log(i + 1, 'test passed', r);
    } catch (error) {
      console.error(error);
      console.error(i + 1, 'TEST FAILED', r);
    }
  }
})();
