/* eslint-disable no-console */
const { Aki, regions } = require('../index');

const testGame = async (region) => {
  const aki = new Aki(region);

  await aki.start();
  console.log(`${region} - start: ${aki.question} ${aki.progress}`);

  await aki.step(0);
  console.log(`${region} - step: ${aki.currentStep} ${aki.question} ${aki.progress}`);

  await aki.back();
  console.log(`${region} - back: ${aki.currentStep} ${aki.question} ${aki.progress}`);

  while (aki.progress <= 50 && aki.currentStep < 15) {
    await aki.step(Math.floor(Math.random() * 2));
    console.log(`${region} - step: ${aki.currentStep} ${aki.question} ${aki.progress}`);

    if (Math.floor(Math.random() * 10) < 1 && aki.currentStep > 1) {
      await aki.back();
      console.log(`${region} - back: ${aki.currentStep} ${aki.question} ${aki.progress}`);
    }
  }


  await aki.win();
  // console.log('win:', aki.question, aki.answers);
};

(async () => {
  console.log('Starting tests...');
  for (let i = 0; i < regions.length; i += 1) {
    const region = regions[i];
    try {
      await testGame(region);
      console.log(i + 1, 'test passed', region);
    } catch (error) {
      console.error(error);
      console.error(i + 1, 'TEST FAILED', region);
    }
  }
  await testGame('random default to en pls');
  // regions.forEach(async (region, i) => {
  // try {
  //   await testGame(region);
  //   console.log(i + 1, 'test passed', region);
  // } catch (error) {
  //   console.error(error);
  //   console.error(i + 1, 'TEST FAILED', region);
  // }
  // });
})();
