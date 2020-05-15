const { issues } = require('../lib/constants/Client');

/**
 * shows the akinator api errors
 * @param body the akinator errors
 * @param region the region the errors occurred.
 */
const AkinatorAPIErrors = (body, region) => {
  if (!body || !body.completion) throw new Error(`A problem occurred with making the request.\nRequest Body: ${body}`);

  if (body.completion === 'KO - SERVER DOWN') throw new Error(`Akinator servers are down for the "${region}" region. Check back later. ${body.completion}`);

  if (body.completion === 'KO - TECHNICAL ERROR') throw new Error(`Akinator's servers have had a technical error for the "${region}" region. Check back later. ${body.completion}`);

  if (body.completion === 'KO - INCORRECT PARAMETER') throw new Error(`You inputted a wrong paramater, this could be session, region, or signature. ${body.completion}`);

  if (body.completion === 'KO - TIMEOUT') throw new Error(`Your Akinator session has timed out. ${body.completion}`);

  if (body.completion === 'WARN - NO QUESTION') throw new Error(`No question found. ${body.completion}`);

  if (body.completion === 'KO - MISSING PARAMETERS') throw new Error(`Akinator needs more parameters. Please make an issue at: ${issues}`);

  throw new Error(`Unknown error has occurred. Server response: ${body.completion}`);
};

module.exports = AkinatorAPIErrors;
