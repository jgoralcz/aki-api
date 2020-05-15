const request = require('../lib/functions/Request');
const getURL = require('../lib/functions/GetURL');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');
const { jQuery } = require('../lib/constants/Client');

/**
 * gets a step for aki by requesting the correct data.
 * @param region the supplied region area.
 * @param session the akinator session
 * @param signature the akinator signature
 * @param answerId the answer that resembles the question
 * @param step the number of step this is on.
 */
module.exports = async (region, session, signature, answerId, step, frontAddr) => {
  const { uri, urlApiWs } = getURL(region);

  // https://en.akinator.com/answer_api?callback=jQuery34103933368882963064_1589513884938&urlApiWs=https%3A%2F%2Fsrv13.akinator.com%3A9361%2Fws&session=1432&signature=735251018&step=0&frontaddr=MTQ3LjEzNS4xMjkuOTM%3D&answer=0&question_filter=&_=1589513884940
  const result = await request(`https://${uri}/answer_api?callback=${jQuery + new Date().getTime()}&urlApiWs=https://${urlApiWs}/ws&session=${session}&signature=${signature}&step=${step}&answer=${answerId}&frontaddr=${frontAddr}`);
  const { body, statusCode } = result;

  if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.question) return akinatorAPIErrors(body, region);

  return {
    nextQuestion: body.parameters.question,
    progress: body.parameters.progression,
    answers: body.parameters.answers.map(ans => ans.answer),
    currentStep: step,
    nextStep: step + 1,
    frontAddr,
  };
};
