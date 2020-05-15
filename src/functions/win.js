const request = require('../lib/functions/Request');
const { jQuery } = require('../lib/constants/Client');
const getURL = require('../lib/functions/GetURL');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');

/**
 * gets a step for aki by requesting the correct data.
 * @param region the supplied region area.
 * @param session the akinator session
 * @param signature the akinator signature
 * @param step the number of step this is on.
 */
module.exports = async (region, session, signature, step) => {
  const { urlApiWs } = getURL(region);

  const result = await request(`https://${urlApiWs}/ws/list?callback=${jQuery + new Date().getTime()}&signature=${signature}&step=${step}&session=${session}`);
  const { body, statusCode } = result;

  if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.question) return akinatorAPIErrors(body, region);

  return {
    answers: (body.parameters.elements || []).map(ele => ele.element),
    currentStep: step,
    nextStep: step + 1,
    guessCount: body.parameters.NbObjetsPertinents, // number of guesses akinator holds
  };
};
