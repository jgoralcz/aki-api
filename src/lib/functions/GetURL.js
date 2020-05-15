/**
 * Returns the id from the correct region.
 * @param region The regions aki supports: 'en', 'en_object', 'en_animals',
 * 'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
 * 'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'.
 * Default is 'en'
 * @returns {string}
 */
const regionURL = (region) => {
  // eslint-disable-next-line no-param-reassign
  region = region.toLowerCase();

  switch (region) {
    // characters
    case 'en':
    case 'english':
      return { uri: 'en.akinator.com', urlApiWs: 'srv13.akinator.com:9361' };

    // objects
    case 'en_object':
    case 'english_objects':
      return { uri: 'en.akinator.com', urlApiWs: 'srv2.akinator.com:9319' };

    // animals
    case 'en_animals':
    case 'english_animals':
      return { uri: 'en.akinator.com', urlApiWs: 'srv2.akinator.com:9318' };

    case 'ar':
    case 'arabic':
      return { uri: 'ar.akinator.com', urlApiWs: 'srv2.akinator.com:9315' };

    case 'cn':
    case 'chinese':
      return { uri: 'cn.akinator.com', urlApiWs: 'srv11.akinator.com:9344' };

    // characters
    case 'de':
    case 'german':
      return { uri: 'de.akinator.com', urlApiWs: 'srv14.akinator.com:9369' };

    // animals
    case 'de_animals':
    case 'german_animals':
      return { uri: 'de.akinator.com', urlApiWs: 'srv14.akinator.com:9370' };

    // characters
    case 'es':
    case 'spanish':
      return { uri: 'es.akinator.com', urlApiWs: 'srv6.akinator.com:9354' };

    // animals
    case 'es_animals':
    case 'spanish_animals':
      return { uri: 'es.akinator.com', urlApiWs: 'srv13.akinator.com:9362' };

    // character
    case 'fr':
    case 'french':
      return { uri: 'fr.akinator.com', urlApiWs: 'srv3.akinator.com:9331' };

    // objects
    case 'fr_object':
    case 'french_object':
      return { uri: 'fr.akinator.com', urlApiWs: 'srv3.akinator.com:9330' };

    // animals
    case 'fr_animals':
    case 'french_animals':
      return { uri: 'fr.akinator.com', urlApiWs: 'srv3.akinator.com:9329' };

    case 'il':
    case 'hebrew':
      return { uri: 'il.akinator.com', urlApiWs: 'srv12.akinator.com:9339' };

    // characters
    case 'it':
    case 'italian':
      return { uri: 'it.akinator.com', urlApiWs: 'srv9.akinator.com:9380' };

    // animals
    case 'it_animals':
    case 'italian_animals':
      return { uri: 'it.akinator.com', urlApiWs: 'srv9.akinator.com:9383' };

    // characters
    case 'jp':
    case 'japanese':
      return { uri: 'jp.akinator.com', urlApiWs: 'srv11.akinator.com:9349' };

    // animals
    case 'jp_animals':
    case 'japanese_animals':
      return { uri: 'jp.akinator.com', urlApiWs: 'srv11.akinator.com:9352' };

    case 'kr':
    case 'korean':
      return { uri: 'kr.akinator.com', urlApiWs: 'srv2.akinator.com:9316' };

    case 'nl':
    case 'dutch':
      return { uri: 'nl.akinator.com', urlApiWs: 'srv9.akinator.com:9381' };

    case 'pl':
    case 'polish':
      return { uri: 'pl.akinator.com', urlApiWs: 'srv14.akinator.com:9143' };

    case 'pt':
    case 'portuguese':
      return { uri: 'pt.akinator.com', urlApiWs: 'srv11.akinator.com:9350' };

    case 'ru':
    case 'russian':
      return { uri: 'ru.akinator.com', urlApiWs: 'srv12.akinator.com:9340' };

    case 'tr':
    case 'turkish':
      return { uri: 'tr.akinator.com', urlApiWs: 'srv3.akinator.com:9332' };

    default:
      return 'srv13.akinator.com:9361';
  }
};

module.exports = regionURL;
