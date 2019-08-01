/* eslint-disable max-len */
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
 * @param stepNum the step the akinator is on in the game session.
 */
const step = (region, session, signature, answerId, stepNum) => stepFunc(region, session, signature, answerId, stepNum);

/**
 * same as answer, but goes back.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param answerId the answer the user clicks. Usually yes, no, don't know, probably, or probably not.
 * @param stepNum the step the akinator is on in the game session.
 */
const back = (region, session, signature, answerId, stepNum) => backFunc(region, session, signature, answerId, stepNum);


/**
 * Called whenever a user wants to test a match.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param stepNum the step the akinator is on in the game session.
 */
const win = (region, session, signature, stepNum) => winFunc(region, session, signature, stepNum);

module.exports = {
  start,
  step,
  back,
  win,
};
