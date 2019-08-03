/**
 * Returns the id from the correct region.
 * @param region The regions aki supports: 'en', 'en2', 'en3', 'en_object', 'en_animals',
 * 'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
 * 'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'.
 * Default is 'en'
 * @returns {string}
 */
const regionURL = (region) => {
  // eslint-disable-next-line no-param-reassign
  region = region.toLowerCase();
  // get region based off of input
  switch (region) {
    // characters
    case 'en':
    case 'english':
      return 'srv2.akinator.com:9162';

    // characters
    case 'en2':
    case 'english2':
      return 'srv6.akinator.com:9126';

    // characters
    case 'en3':
    case 'english3':
      return 'srv11.akinator.com:9152';

    // objects
    case 'en_object':
    case 'english_objects':
      return 'srv2.akinator.com:9265';

    // animals
    case 'en_animals':
    case 'english_animals':
      return 'srv2.akinator.com:9255';

    case 'ar':
    case 'arabic':
      return 'srv2.akinator.com:9155';

    case 'cn':
    case 'chinese':
      return 'srv11.akinator.com:9150';

    // characters
    case 'de':
    case 'german':
      return 'srv14.akinator.com:9283';

    // animals
    case 'de_animals':
    case 'german_animals':
      return 'srv14.akinator.com:9284';

    // characters
    case 'es':
    case 'spanish':
      return 'srv6.akinator.com:9127';

    // animals
    case 'es2':
    case 'spanish2':
      return 'srv13.akinator.com:9257';

    // character
    case 'fr':
    case 'french':
      return 'srv3.akinator.com:9217';

    // objects
    case 'fr_object':
    case 'french_object':
      return 'srv3.akinator.com:9218';

    // animals
    case 'fr_animals':
    case 'french_animals':
      return 'srv3.akinator.com:9259';

    case 'il':
    case 'hebrew':
      return 'srv12.akinator.com:9189';

    // characters
    case 'it':
    case 'italian':
      return 'srv9.akinator.com:9214';

    // animals
    case 'it_animals':
    case 'italian_animals':
      return 'srv9.akinator.com:9261';

    // characters
    case 'jp':
    case 'japanese':
      return 'srv11.akinator.com:9172';

      // animals
    case 'jp_animals':
    case 'japanese_animals':
      return 'srv11.akinator.com:9263';

    case 'kr':
    case 'korean':
      return 'srv2.akinator.com:9156';

    case 'nl':
    case 'dutch':
      return 'srv9.akinator.com:9215';

    case 'pl':
    case 'polish':
      return 'srv14.akinator.com:9282';

    case 'pt':
    case 'portuguese':
      return 'srv2.akinator.com:9161';

    case 'ru':
    case 'russian':
      return 'srv12.akinator.com:9190';

    case 'tr':
    case 'turkish':
      return 'srv3.akinator.com:9211';

    default:
      return 'srv13.akinator.com:9196';
  }
};

module.exports = regionURL;
