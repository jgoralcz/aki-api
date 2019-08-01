const startFunc = require('./src/functions/start.js');
const stepFunc = require('./src/functions/step.js');
const backFunc = require('./src/functions/back.js');
const winFunc = require('./src/functions/win.js');

/**
 * starts the akinator. Creats ax unique game session and returns data.
 * @param region the region that akinator supports. English is default.
 */
const start = region => startFunc(region);


/**
 * gets the answer from the akinator's game session and returns data.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param answerId the answer the user clicks. Usually yes, no, don't know, probably, or probably not.
 * @param step the step the akinator is on in the game session.
 */
const step = (region, session, signature, answerId, step) => stepFunc(region, session, signature, answerId, step);

/**
 * same as answer, but goes back.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param answerId the answer the user clicks. Usually yes, no, don't know, probably, or probably not.
 * @param step the step the akinator is on in the game session.
 */
const back = (region, session, signature, answerId, step) => backFunc(region, session, signature, answerId, step);


/**
 * Called whenever a user wants to test a match.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param step the step the akinator is on in the game session.
 */
const win = (region, session, signature, step) => winFunc(region, session, signature, step);

module.exports = {
  start,
  step,
  back,
  win,
};
