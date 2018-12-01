/**
 * Returns the id from the correct region.
 * @param region The regions aki supports: 'en', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', and 'tr'. Default is 'en'
 * @returns {string}
 */
exports.regionURL = function (region) {
    let id;

    //lowercase because of you noobs
    region = region.toLowerCase();
    //get region based off of input
    switch (region) {

        case "en":
        case "english":
            id = "srv11.akinator.com:9152";
            break;

        case "en2":
        case "english":
            id = "srv6.akinator.com:9126";
            break;

        case "ar":
        case "arabic":
            id = "srv2.akinator.com:9155";
            break;

        case "cn":
        case "chinese":
            id = "srv11.akinator.com:9150";
            break;

        case "de":
        case "german":
            id = "srv7.akinator.com:9145";
            break;

        case "es":
        case "spanish":
            id = "srv11.akinator.com:9151";
            break;

        //person, blame akinator not me
        case "fr":
        case "french":
            id = "srv3.akinator.com:9165";
            break;

        //objects
        case "fr2":
        case "french":
            id = "srv3.akinator.com:9167";
            break;

        case "il":
        case "hebrew":
            id = "srv12.akinator.com:9189";
            break;

        case "it":
        case "italian":
            id = "srv9.akinator.com:9131";
            break;

        case "jp":
        case "japanese":
            id = "srv11.akinator.com:9172";
            break;

        case "kr":
        case "korean":
            id = "srv2.akinator.com:9156";
            break;

        case "nl":
        case "dutch":
            id = "srv9.akinator.com:9133";
            break;

        case "pl":
        case "polish":
            id = "srv7.akinator.com:9143";
            break;

        case "pt":
        case "portuguese":
            id = "srv3.akinator.com:9166";
            break;

        case "ru":
        case "russian":
            id = "srv12.akinator.com:9190";
            break;

        case "tr":
        case "turkish":
            id = "srv3.akinator.com:9164";
            break;

        //default case
        default:
            id = "srv11.akinator.com:9152";
            break;
    }

    return id;
};
