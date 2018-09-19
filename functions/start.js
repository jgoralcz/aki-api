const request = require('request-promise');
const url = require("./getURL.js");

/**
 * starts the game.
 * @param region
 * @param callback
 */
module.exports = async (region, callback) => {
    const id = url.regionURL(region); //gets id

    const opts = {
        method: 'GET',
        json: true,
        uri: `https://${id}/ws/new_session?callback=&partner=&player=website-desktop&uid_ext_session=&frontaddr=NDYuMTA1LjExMC40NQ==&constraint=ETAT<>'AV'`,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        },
        gzip: true
    }

    //get the json data, and await it
    const json = await request(opts).catch(console.error);

    //if there is a callback then use that
    if(callback != null) {
        if (json.completion === 'OK') {
            try {
                //resolve callback
                callback(jsonComplete(json));
            } catch (e) {
                console.error(e);
                callback(json);
            }
        }
        //else errors
        else if (json.completion === 'KO - SERVER DOWN') {
            callback(null, `Akinator servers are down for the "${region}" region. Check back later.\n${json.completion}`);
        } else if (json.completion === 'KO - TECHNICAL ERROR') {
            callback(null, `Akinator's servers have had a technical error for the "${region}" region. Check back later.\n${json.completion}`);
        } else {
            callback(null, `Unknown error has occured.\n${json.completion}`);
        }
    }

    //else use promise
    else {
        return new Promise( (resolve, reject) => {
            if (json.completion === 'OK') {
                try {
                    //resolve the function
                    resolve(jsonComplete(json));
                } catch(e) {
                    console.error(e);
                    reject(json);
                }
            }
            //else errors
            else if (json.completion === 'KO - SERVER DOWN') {
                reject(`Akinator servers are down for the "${region}" region. Check back later.\n${json.completion}`);
            } else if (json.completion === 'KO - TECHNICAL ERROR') {
                reject(`Akinator's servers have had a technical error for the "${region}" region. Check back later.\n${json.completion}`);
            } else {
                reject(`Unknown error has occured.\n${json.completion}`);
            }
        });
    }
}

/**
 * parses out the json info
 * @param json the json information from the request
 */
function jsonComplete(json) {
    let ans = [];
    for (let i = 0; i < json.parameters.step_information.answers.length; i++) {
        ans.push(json.parameters.step_information.answers[i].answer);
    }
    return {
        "session": json.parameters.identification.session,
        "signature": json.parameters.identification.signature,
        "question": json.parameters.step_information.question,
        "answers": ans
    };
}