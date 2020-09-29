const axios = require('axios');
const { patternSession, issues } = require('../constants/Client');

/**
 * gets the session uid and frontaddr needed to play the game.
 * @returns {Promise<{uid: string, frontaddr: string}>}
 */
const getSession = async () => {
  let html = await axios.get('https://en.akinator.com/game').catch(() => null);
  html = html.data;
  // use pattern matching to get the uid and frontaddr. It looks like:
  // var uid_ext_session = 'a7560672-6944-11e9-bbad-0cc47a40ef18';
  // var frontaddr = 'NDYuMTA1LjExMC40NQ==';
  if (html != null && html.match(patternSession)) {
    const uid = patternSession.exec(html)[1];
    const frontaddr = patternSession.exec(html)[2];
    return { uid, frontaddr };
  }
  throw new Error(`Cannot find the uid and frontaddr. Please report to the github at: ${issues}`);
};

module.exports = getSession;
