/**
 * starts the akinator. Creats a unique game session and returns data.
 * @param regionm the region that akinator supports. English is default.
 * @param callback the callback function, or promise if none is provided.
 */
exports.start = function (region, callback) {
    return require('./functions/start')(region, callback);
};


/**
 * gets the answer from the akinator's game session and returns data.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param answerId the answer the user clicks. Usually yes, no, don't know, probably, or probably not.
 * @param step the step the akinator is on in the game session.
 * @param callback the callback function, or promise if none is provided.
 */
exports.step = function (region, session, signature, answerId, step, callback) {
    return require('./functions/step')(region, session, signature, answerId, step, callback);
};

/**
 * same as answer, but goes back.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param answerId the answer the user clicks. Usually yes, no, don't know, probably, or probably not.
 * @param step the step the akinator is on in the game session.
 * @param callback the callback function, or promise if none is provided.
 */
exports.back = function (region, session, signature, answerId, step, callback) {
    return require('./functions/back')(region, session, signature, answerId, step, callback);
};


/**
 * Called whenever a user wants to test a match.
 * @param region the region that akinator supports. English is default.
 * @param session the akinator game session. Has a unique id.
 * @param signature the akinator signature. Has a unique id.
 * @param step the step the akinator is on in the game session.
 * @param callback the callback function, or promise if none is provided.
 */
exports.win = function (region, session, signature, step, callback) {
    return require('./functions/win')(region, session, signature, step, callback);
};


/**
 * gets whatever uri that akinator uses because they seem to change it consistently.
 * @param region The regions aki supports: 'en', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'. Default is 'en'
 */
// exports.regionURL = function (region) {
// };

