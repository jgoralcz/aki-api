const request = require('request-promise');
const url = require("./getURL.js");

/**
 * starts the game.
 * @param region the region to connect to the akinator (see getURL.js or documentation)
 */
module.exports = async (region) => {
    const id = url.regionURL(region); //gets id

    // request akinator.com/game so we get the uid_ext_session and frontaddr.
    const uriObj = await getSession();
    const uid = uriObj.uid;
    const frontaddr = uriObj.frontaddr;

    // the options for the request
    const opts = {
        method: 'GET',
        json: true,
        uri: `https://${id}/ws/new_session?partner=1&player=website-desktop&uid_ext_session=${uid}&frontaddr=${frontaddr}&constraint=ETAT%%3C%%3E%%27AV%%27&constraint=ETAT<>'AV'`,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        },
        gzip: true
    };

    // get the json data, and await it
    const json = await request(opts).catch(console.error);

    if(json == null || !json.completion) {
        throw new Error(`A problem occurred with making the request.\nRequest Value: ${json}`);
    }

    if (json.completion === 'OK') {
        return {
            'session': json.parameters.identification.session,
            'signature': json.parameters.identification.signature,
            'question': json.parameters.step_information.question,
            'challenge_auth': json.parameters.identification.challenge_auth,
            'answers': json.parameters.answers.map( ans => ans.answer) || []
        };
    }
    // else errors
    else if (json.completion === 'KO - SERVER DOWN') {
        throw new Error(`Akinator servers are down for the "${region}" region. Check back later.\n${json.completion}`);
    } else if (json.completion === 'KO - TECHNICAL ERROR') {
        throw new Error(`Akinator's servers have had a technical error for the "${region}" region. Check back later.\n${json.completion}`);
    } else {
        throw new Error(`Unknown error has occured.\n${json.completion}`);
    }
};

// pattern to match see below for what we're looking for.
const patternSession = new RegExp("var uid_ext_session = '(.*)';\\n.*var frontaddr = '(.*)';");

/**
 * gets the session uid and frontaddr
 * @returns {Promise<{uid: string, frontaddr: string}>}
 */
const getSession = async () => {
    let uid = '';
    let frontaddr = '';

    // request the new url
    const html = await request({uri: 'https://en.akinator.com/game'});

    // use pattern matching to get the uid and frontaddr. It looks like:
    // var uid_ext_session = 'a7560672-6944-11e9-bbad-0cc47a40ef18';
    // var frontaddr = 'NDYuMTA1LjExMC40NQ==';
    if (html.match(patternSession)) {
        uid = patternSession.exec(html)[1];
        frontaddr = patternSession.exec(html)[2];
    }
    else {
        throw new Error('Cannot find the uid and frontaddr.');
    }


    return {uid: uid, frontaddr: frontaddr};
};