/**
 * Returns the id from the correct region.
 * @param akinatorRegion The regions aki supports: 'en', 'en_objects', 'en_animals',
 * 'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
 * 'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'.
 * Default is 'en'
 * @returns {string}
 */
const regionURL = (akinatorRegion) => {
  const region = akinatorRegion.toLowerCase();

  switch (region) {
    case 'en':
    case 'english':
      return { uri: 'en.akinator.com', urlApiWs: 'srv13.akinator.com:9361' };

    case 'en_objects':
    case 'english_objects':
      return { uri: 'en.akinator.com', urlApiWs: 'srv2.akinator.com:9319' };

    case 'en_animals':
    case 'english_animals':
      return { uri: 'en.akinator.com', urlApiWs: 'srv2.akinator.com:9318' };

    case 'ar':
    case 'arabic':
      return { uri: 'ar.akinator.com', urlApiWs: 'srv2.akinator.com:9315' };

    case 'cn':
    case 'chinese':
      return { uri: 'cn.akinator.com', urlApiWs: 'srv11.akinator.com:9344' };

    case 'de':
    case 'german':
      return { uri: 'de.akinator.com', urlApiWs: 'srv14.akinator.com:9369' };

    case 'de_animals':
    case 'german_animals':
      return { uri: 'de.akinator.com', urlApiWs: 'srv14.akinator.com:9370' };

    case 'es':
    case 'spanish':
      return { uri: 'es.akinator.com', urlApiWs: 'srv6.akinator.com:9354' };

    case 'es_animals':
    case 'spanish_animals':
      return { uri: 'es.akinator.com', urlApiWs: 'srv13.akinator.com:9362' };

    case 'fr':
    case 'french':
      return { uri: 'fr.akinator.com', urlApiWs: 'srv3.akinator.com:9331' };

    case 'fr_objects':
    case 'french_objects':
      return { uri: 'fr.akinator.com', urlApiWs: 'srv3.akinator.com:9330' };

    case 'fr_animals':
    case 'french_animals':
      return { uri: 'fr.akinator.com', urlApiWs: 'srv3.akinator.com:9329' };

    case 'il':
    case 'hebrew':
      return { uri: 'il.akinator.com', urlApiWs: 'srv12.akinator.com:9339' };

    case 'it':
    case 'italian':
      return { uri: 'it.akinator.com', urlApiWs: 'srv9.akinator.com:9380' };

    case 'it_animals':
    case 'italian_animals':
      return { uri: 'it.akinator.com', urlApiWs: 'srv9.akinator.com:9383' };

    case 'jp':
    case 'japanese':
      return { uri: 'jp.akinator.com', urlApiWs: 'srv11.akinator.com:9349' };

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
      return { uri: 'en.akinator.com', urlApiWs: 'srv13.akinator.com:9361' };
  }
};

module.exports = regionURL;
