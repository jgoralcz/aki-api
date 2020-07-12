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
      urlWs: themeName && found && found.UrlWs ? found.UrlWs : parsed[0].urlWs,
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
<<<<<<< HEAD
      return getServer('en');
=======
      return { uri: 'en.akinator.com', urlApiWs: 'srv2.akinator.com:9317' };
>>>>>>> 6f9dbad68bc70534f44f60b75c2b8efa148c4da7

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
<<<<<<< HEAD
      return getServer('es');
=======
      return { uri: 'es.akinator.com', urlApiWs: 'srv6.akinator.com:9402' };
>>>>>>> 6f9dbad68bc70534f44f60b75c2b8efa148c4da7

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
<<<<<<< HEAD
      return getServer('pl');

    case 'pt':
    case 'portuguese':
      return getServer('pt');

    case 'ru':
    case 'russian':
      return getServer('ru');
=======
      return { uri: 'pl.akinator.com', urlApiWs: 'srv14.akinator.com:9368' };

    case 'pt':
    case 'portuguese':
      return { uri: 'pt.akinator.com', urlApiWs: 'srv11.akinator.com:9401' };

    case 'ru':
    case 'russian':
      return { uri: 'ru.akinator.com', urlApiWs: 'srv12.akinator.com:9398' };
>>>>>>> 6f9dbad68bc70534f44f60b75c2b8efa148c4da7

    case 'tr':
    case 'turkish':
      return getServer('tr');

    default:
<<<<<<< HEAD
      return region ? getServer(region) : getServer('en');
=======
      return { uri: 'en.akinator.com', urlApiWs: 'srv2.akinator.com:9317' };
>>>>>>> 6f9dbad68bc70534f44f60b75c2b8efa148c4da7
  }
};

module.exports = regionURL;
