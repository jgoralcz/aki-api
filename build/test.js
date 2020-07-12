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

  // Gets first argument (region), if any
  let selected = process.argv.length > 2 ? process.argv.slice(2)[0] : 'all';

  // "npm test -- all" or just "npm test". Test all servers
  if (selected == 'all') {
    let passed = [], failed = [];
    for (let i = 0; i < regions.length; i += 1) {
      const region = regions[i];
      try {
        await testGame(region);
        console.log(i + 1, 'test passed', region);
        passed.push(region);
      } catch (error) {
        console.error(error);
        console.error(i + 1, 'TEST FAILED', region);
        failed.push(region);
      }
    }
    
    console.log(passed.length, 'tests passed in total');

    if (failed.length) {
      console.log(failed.length, 'tests failed. Servers that did not respond:');
      for (let i = 0; i < failed.length; i += 1) {
        console.log(failed[i]);
      }
    } else {
      console.log('All tests passed!');
    }
  } else {
    // "npm test -- <selected>". Tests the selected server
    console.log('Testing ', selected);
    try {
      await testGame(selected);
      console.log('Test passed');
    } catch (error) {
      console.error(error);
      console.error('TEST FAILED');
    }
  }
})();
