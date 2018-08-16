const aki-api = require('./index');

// List of Regions
/*
   us - English
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

answerid = '0'
step = '0'


// Example
api.start('us', (gamedata, error) => {
  if (error) {
    console.log(error);
  } else {
    gd = JSON.parse(gamedata)
    api.answer('us', gd.session, gd.signature, answerid, step, (next, error) => {
      if (error) {

      } else {
        console.log(next);
        step++;
      }
    })
  }
})

/*api.answer(session, signature, answerid, (next, error) => {

})*/
