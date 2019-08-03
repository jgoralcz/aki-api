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
module.exports = async (region, session, signature, answerId, step) => {
  const id = getURL(region);
  const result = await request(`https://${id}/ws/answer?callback=${jQuery}${new Date().getTime()}&session=${session}&signature=${signature}&step=${step}&answer=${answerId}`);
  const { body, statusCode } = result;
  if (statusCode === 200 && body && body.completion === 'OK') {
    return {
      nextQuestion: body.parameters.question,
      progress: body.parameters.progression,
      answers: body.parameters.answers.map(ans => ans.answer),
      currentStep: step,
      nextStep: step + 1,
    };
  }
  return akinatorAPIErrors(body, region);
};
