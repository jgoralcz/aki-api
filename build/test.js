const aki = require('../index');
// start off the game, start does not have these properties due to the website.
const regions = ['en', 'en2', 'en3', 'en_object', 'en_animals',
  'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
  'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr'];

// example
const testGame = async (region) => {
  const startGame = await aki.start(region);
  const step = 0;

  console.log(`game started: ${JSON.stringify(startGame, null, 2)}`);

  if (startGame != null) {
    const answerId = 0;
    const answer = await aki.step(region, startGame.session, startGame.signature, answerId, step);
    console.log(`step: ${JSON.stringify(answer, null, 2)}`);
    // setup your own
    if (answer.progress >= 85) {
      const guessWin = await aki.win(region, startGame.session, startGame.signature, startGame, step + 1);
      const { answers } = guessWin;
      console.log(`I guess: ${answers[0].name}\n${answers[0].absolute_picture_path}`); // or other element names in the array
    } else {
      // loop back through the step or use recursion
    }
  }
};


// run the test game
for (let i = 0; i < regions.length; i += 1) {
  testGame(regions[i]).then(() => {
    console.log('finished');
  })
    .catch(console.error);
}

// full game test
(async () => {
  const region = 'en';
  const startGame = await aki.start(region);
  let answerId = 0;
  let currentStep = await aki.step(region, startGame.session, startGame.signature, answerId, 0);


  // WARNING DO NOT ACTUALLY DO THIS IN YOUR CODE
  // THIS WILL BLOCK THE THREAD. BAD BAD BAD!!!
  while (currentStep.progress <= 85) {
    answerId = Math.floor(Math.random() * 2);
    currentStep = await aki.step(region, startGame.session, startGame.signature, answerId, currentStep.nextStep);
  }
  const answer = await aki.win(region, startGame.session, startGame.signature, currentStep.nextStep).catch(console.error);
  console.log(answer);
  process.exit(1);
})();


