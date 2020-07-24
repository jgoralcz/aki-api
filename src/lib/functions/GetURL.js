const rp = require('request-promise');

/**
 * gets the server automatically, so we don't rely on hard coded values.
 * @param {string} region the requested region to be parsed
 * @return {object} obj with url and urlWs or undefined
 */
const getServer = async (region) => {
  try {
    const split = region.split('_');
    const [language, themeName] = split;

    const url = `https://${language}.akinator.com`;
    const page = await rp.get(url);

    const regex = /\[{"translated_theme_name":"[\s\S]*","urlWs":"https:\\\/\\\/srv[0-9]+\.akinator\.com:[0-9]+\\\/ws","subject_id":"[0-9]+"}]/gim;
    const parsed = JSON.parse(page.match(regex));

    if (!parsed || !parsed[0] || !parsed[0].urlWs || parsed.length <= 0) return undefined;

    const found = parsed.find(theme => theme.translated_theme_name.toLowerCase() === themeName);

    const obj = {
      url,
      urlWs: themeName && found && found.urlWs ? found.urlWs : parsed[0].urlWs,
    };

    return obj;
  } catch (error) {
    console.error(error);
  }
  return undefined;
};


/**
 * Returns the id from the correct region.
 * @param akinatorRegion The regions aki supports: 'en', 'en_objects', 'en_animals',
 * 'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
 * 'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'.
 * Default is 'en'
 * @returns {string}
 */
const regionURL = async (akinatorRegion) => {
  const region = akinatorRegion.toLowerCase();

  switch (region) {
    case 'en':
    case 'english':
      return getServer('en');

    case 'en_objects':
    case 'english_objects':
      return getServer('en_objects');

    case 'en_animals':
    case 'english_animals':
      return getServer('en_animals');

    case 'ar':
    case 'arabic':
      return getServer('ar');

    case 'cn':
    case 'chinese':
      return getServer('cn');

    case 'de':
    case 'german':
      return getServer('de');

    case 'de_animals':
    case 'german_animals':
      return getServer('de_animals');

    case 'es':
    case 'spanish':
      return getServer('es');

    case 'es_animals':
    case 'spanish_animals':
      return getServer('es_animals');

    case 'fr':
    case 'french':
      return getServer('fr');

    case 'fr_objects':
    case 'french_objects':
      return getServer('fr_objects');

    case 'fr_animals':
    case 'french_animals':
      return getServer('fr_animals');

    case 'il':
    case 'hebrew':
      return getServer('il');

    case 'it':
    case 'italian':
      return getServer('it');

    case 'it_animals':
    case 'italian_animals':
      return getServer('it_animals');

    case 'jp':
    case 'japanese':
      return getServer('jp');

    case 'jp_animals':
    case 'japanese_animals':
      return getServer('jp_animals');

    case 'kr':
    case 'korean':
      return getServer('kr');

    case 'nl':
    case 'dutch':
      return getServer('nl');

    case 'pl':
    case 'polish':
      return getServer('pl');

    case 'pt':
    case 'portuguese':
      return getServer('pt');

    case 'ru':
    case 'russian':
      return getServer('ru');

    case 'tr':
    case 'turkish':
      return getServer('tr');

    default:
      return region ? getServer(region) : getServer('en');
  }
};

module.exports = regionURL;
