const getURL = require('../lib/functions/GetURL');
const { jQuery } = require('../lib/constants/Client');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');
const request = require('../lib/functions/Request');
const getSession = require('../lib/functions/GetSession');

/**
 * starts the game.
 * @param region the region to connect to the akinator (see GetURL.js or documentation)
 */
module.exports = async (region) => {
  const id = getURL(region);

  // request akinator.com/game so we get the uid_ext_session and frontaddr.
  const uriObj = await getSession();
  const { uid, frontaddr } = uriObj;
  const result = await request(`https://${id}/ws/new_session?callback=${jQuery}${new Date().getTime()}&partner=1&player=website-desktop&uid_ext_session=${uid}&frontaddr=${frontaddr}&constraint=ETAT%%3C%%3E%%27AV%%27&constraint=ETAT<>'AV'`);
  const { body, statusCode } = result;
  if (statusCode === 200 && body && body.completion === 'OK') {
    return {
      session: body.parameters.identification.session,
      signature: body.parameters.identification.signature,
      question: body.parameters.step_information.question,
      challenge_auth: body.parameters.identification.challenge_auth,
      answers: body.parameters.step_information.answers.map(ans => ans.answer),
    };
  }
  return akinatorAPIErrors(body, region);
};
