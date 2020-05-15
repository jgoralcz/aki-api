const request = require('../lib/functions/Request');
const getURL = require('../lib/functions/GetURL');
const { jQuery } = require('../lib/constants/Client');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');

/**
 * gets a step for aki by requesting the correct data.
 * @param {String} region the supplied region area.
 * @param {String} session the session id
 * @param {String} signature the signature id
 * @param {BigInt} answerId the answer that resembles the question
 * @param {String} step the number of step this is on.
 */
module.exports = async (region, session, signature, answerId, step) => {
  const { urlApiWs } = getURL(region);

  const result = await request(`https://${urlApiWs}/ws/cancel_answer?&callback=${jQuery + new Date().getTime()}&session=${session}&signature=${signature}&step=${step}&answer=-1`);
  const { body, statusCode } = result;

  if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.question) return akinatorAPIErrors(body, region);

  return {
    nextQuestion: body.parameters.question,
    progress: body.parameters.progression,
    answers: body.parameters.answers.map(ans => ans.answer),
    currentStep: step,
    nextStep: step - 1,
  };
};
