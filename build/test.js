"use strict"

const aki = require('../index');

// List of Regions
/*
   en - English
   en2 - English 2nd server
   de - German
   fr - French
   in - Hindi
   es - Spanish
   cn - Chinese
   ar - Arabic
   il - Hebrew
   it - Italian
   jp - Japanese
   kr - Korean
   nl- Netherlands
   pl - Polish
   pt - Portuguese
   ru - Russian
   tr - Turkish
*/


//start off the game, start does not have these properties due to the website.
let answerId = 0;
let step = 0;

const regions = ['en', 'en2', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr'];


// Example
aki.start('en', (gd, error) => {
  if (error) {
    console.log(error);
  } else {
    aki.step('en', gd.session, gd.signature, answerId, step, (next, error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(next);
        step++;
      }
    });
  }
});

//example 2
const testGame = async (region) => {

  const startGame = await aki.start(region);

  console.log("game started: " + JSON.stringify(startGame, null, 2));

  if(startGame != null) {
    let answer = await aki.step(region, startGame.session, startGame.signature, answerId, step);
    //then use startGame.nextStep;

    console.log("step: " + JSON.stringify(answer, null, 2));


    //setup your own 
    if(answer.progress >= 85) {
      const guessWin = aki.win(region, startGame.session, startGame.signature, startGame, step+1);

      console.log("I guess: " + guessWin.answers[0].name + "\n" + guessWin.answers[0].absolute_picture_path); //or other element names in the array
    }

    else {
      //loop back through the step or use recursion
    }
  }
};


//run the test game
for(let i = 0; i < regions.length; i++) {
  testGame(regions[i]).then( () => {
    console.log('finished');
  })
  .catch(console.error);
}
