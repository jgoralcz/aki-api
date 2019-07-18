/**
 * Returns the id from the correct region.
 * @param region The regions aki supports: 'en', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'. Default is 'en'
 * @returns {string}
 */
exports.regionURL = function (region) {
    let id;

    // lowercase because of you noobs
    region = region.toLowerCase();
    // get region based off of input
    switch (region) {

        // characters
        case 'en':
        case 'english':
            id = 'srv13.akinator.com:9196';
            break;

        // characters
        case 'en2':
        case 'english2':
            id = 'srv6.akinator.com:9126';
            break;

        // characters
        case 'en3':
        case 'english3':
            id = 'srv11.akinator.com:9152';
            break;

        // objects
        case 'en4':
        case 'english4':
            id = 'srv2.akinator.com:9265';
            break;

        // animals
        case 'en5':
        case 'english5':
            id = 'srv2.akinator.com:9255';
            break;

        case 'ar':
        case 'arabic':
            id = 'srv2.akinator.com:9155';
            break;

        case 'cn':
        case 'chinese':
            id = 'srv11.akinator.com:9150';
            break;

        // characters
        case 'de':
        case 'german':
            id = 'srv14.akinator.com:9283';
            break;

        // animals
        case 'de2':
        case 'german2':
            id = 'srv14.akinator.com:9284';
            break;

        // characters
        case 'es':
        case 'spanish':
            id = 'srv6.akinator.com:9127';
            break;

        // animals
        case 'es2':
        case 'spanish2':
            id = 'srv13.akinator.com:9257';
            break;


        // character
        case 'fr':
        case 'french':
            id = 'srv3.akinator.com:9217';
            break;


        // objects
        case 'fr2':
        case 'french2':
            id = 'srv3.akinator.com:9218';
            break;

        // animals
        case 'fr3':
        case 'french3':
            id = 'srv3.akinator.com:9259/';
            break;

        case 'il':
        case 'hebrew':
            id = 'srv12.akinator.com:9189';
            break;


        // characters
        case 'it':
        case 'italian':
            id = 'srv9.akinator.com:9214';
            break;

        // animals
        case 'it2':
        case 'italian2':
            id = 'srv9.akinator.com:9261';
            break;

        // characters
        case 'jp':
        case 'japanese':
            id = 'srv11.akinator.com:9172';
            break;

        // animals
        case 'jp2':
        case 'japanese2':
            id = 'srv11.akinator.com:9263';
            break;

        case 'kr':
        case 'korean':
            id = 'srv2.akinator.com:9156';
            break;

        case 'nl':
        case 'dutch':
            id = 'srv9.akinator.com:9215';
            break;

        case 'pl':
        case 'polish':
            id = 'srv7.akinator.com:9240';
            break;

        case 'pt':
        case 'portuguese':
            id = 'srv2.akinator.com:9161';
            break;

        case 'ru':
        case 'russian':
            id = 'srv12.akinator.com:9190';
            break;

        case 'tr':
        case 'turkish':
            id = 'srv3.akinator.com:9211';
            break;

        // default case
        default:
            id = 'srv13.akinator.com:9196';
            break;
    }

    return id;
};
