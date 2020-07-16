/* eslint-disable no-console */
const { Aki, regions } = require('../index');

const testGame = async (region, childMode) => {
  const aki = new Aki(region);

  await aki.start();
  console.log(`${region} ${childMode} - start: ${aki.question} ${aki.progress}`);

  await aki.step(0);
  console.log(`${region} ${childMode} - step: ${aki.currentStep} ${aki.question} ${aki.progress}`);

  await aki.back();
  console.log(`${region} ${childMode} - back: ${aki.currentStep} ${aki.question} ${aki.progress}`);

  while (aki.progress <= 50 && aki.currentStep < 15) {
    await aki.step(Math.floor(Math.random() * 2));
    console.log(`${region} ${childMode} - step: ${aki.currentStep} ${aki.question} ${aki.progress}`);

    if (Math.floor(Math.random() * 10) < 1 && aki.currentStep > 1) {
      await aki.back();
      console.log(`${region} ${childMode} - back: ${aki.currentStep} ${aki.question} ${aki.progress}`);
    }
  }


  await aki.win();
  console.log('win:', aki.question);
};

(async () => {
  console.log('Starting tests...');

  const selectedRegion = process.argv.length > 2 ? process.argv.slice(2)[0] : 'all';

  // "npm test -- all" or just "npm test". Test all servers
  if (selectedRegion === 'all') {
    const passed = [];
    const failed = [];
    for (let i = 0; i < regions.length; i += 1) {
      const region = regions[i];
      try {
        const childMode = Math.random() > 0.5;
        await testGame(region, childMode);
        console.log(i + 1, 'test passed', region);
        passed.push(region);
      } catch (error) {
        console.error(error);
        console.error(i + 1, 'TEST FAILED', region);
        failed.push(region);
      }
    }

    console.log(passed.length, 'tests passed in total');

    if (failed.length > 0) {
      console.log(failed.length, 'tests failed. Servers that did not respond:');
      for (let i = 0; i < failed.length; i += 1) {
        console.log(failed[i]);
      }
      return;
    }

    console.log('All tests passed!');
    return;
  }

  // "npm test -- <selected> <childmode>". Tests the selected server.
  // If <childMode> is 'childMode', the test will be made with child mode on
  // If you run "npm test -- <selected> (nothing or any string after)", child mode will be off
  console.log('Testing ', selectedRegion);
  const childMode = process.argv.length > 3 ? process.argv.slice(2)[1].toLowerCase() === 'childmode' : false;
  try {
    await testGame(selectedRegion, childMode);
    console.log('Test passed');
  } catch (error) {
    console.error(error);
    console.error('TEST FAILED');
  }
})();
