const request = require('request-promise');

/**
 * requests for a uri with default options.
 * @param uri the user's uri.
 * @returns {Promise<void>}
 */
const rp = async (uri) => {
  const opts = {
    method: 'GET',
    uri,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    },
    gzip: true,
    resolveWithFullResponse: true,
    timeout: 10000,
  };

  const result = await request(opts).catch(() => null);
  if (result == null) {
    throw new Error(`A problem occurred with making the request.\nRequest Value: ${(result && result.body) ? result.body : result}`);
  }

  // parse out the json
  const beginningParse = result.body.indexOf('(');
  const jsonString = result.body.substring(beginningParse + 1, result.body.length - 1);
  result.body = JSON.parse(jsonString);
  return result;

};

module.exports = rp;
