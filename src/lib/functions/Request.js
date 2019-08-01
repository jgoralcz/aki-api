const request = require('request-promise');

/**
 * requests for a uri with default options.
 * @param uri the user's uri.
 * @returns {Promise<void>}
 */
const rp = async (uri) => {
  const opts = {
    method: 'GET',
    json: true,
    uri,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    },
    gzip: true,
    resolveWithFullResponse: true,
    timeout: 60000,
  };

  const result = await request(opts).catch(console.error);
  if (result == null) {
    throw new Error(`A problem occurred with making the request.\nRequest Value: ${(result && result.body) ? result.body : result}`);
  }
  return result;
};

module.exports = rp;
