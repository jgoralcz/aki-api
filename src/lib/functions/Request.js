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
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',
    },
    gzip: true,
    resolveWithFullResponse: true,
    timeout: 10000,
  };

  try {
    const result = await request(opts);
    const beginningParse = result.body.indexOf('(');
    const jsonString = result.body.substring(beginningParse + 1, result.body.length - 1);
    result.body = JSON.parse(jsonString);
    return result;
  } catch (error) {
    throw new Error(`A problem occurred with making the request: ${error}`);
  }
};

module.exports = rp;
