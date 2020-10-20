const { issues } = require('../lib/constants/Client');

/**
 * shows the akinator api errors
 * @param data the akinator errors
 * @param region the region the errors occurred.
 */
const AkinatorAPIErrors = (data, region) => {
  if (!data || !data.completion) throw new Error(`A problem occurred with making the request.\nRequest Body: ${data}`);

  if (data.completion === 'KO - SERVER DOWN') throw new Error(`Akinator servers are down for the "${region}" region. Check back later. ${data.completion}`);

  if (data.completion === 'KO - TECHNICAL ERROR') throw new Error(`Akinator's servers have had a technical error for the "${region}" region. Check back later. ${data.completion}`);

  if (data.completion === 'KO - INCORRECT PARAMETER') throw new Error(`You inputted a wrong paramater, this could be session, region, or signature. ${data.completion}`);

  if (data.completion === 'KO - TIMEOUT') throw new Error(`Your Akinator session has timed out. ${data.completion}`);

  if (data.completion === 'WARN - NO QUESTION') throw new Error(`No question found. ${data.completion}`);

  if (data.completion === 'KO - MISSING PARAMETERS') throw new Error(`Akinator needs more parameters. Please make an issue at: ${issues}`);

  throw new Error(`Unknown error has occurred. Server response: ${data.completion}`);
};

module.exports = AkinatorAPIErrors;
