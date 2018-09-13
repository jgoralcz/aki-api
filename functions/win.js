const request = require('request-promise');
const url = require("./getURL.js");

/**
 * gets a step for aki by requesting the correct data.
 * @param region the supplied region area.
 * @param session
 * @param signature
 * @param step the number of step this is on.
 * @param callback the callback if provided one.
 */
module.exports = async (region, session, signature, step, callback) => {
    const id = url.regionURL(region);

    const opts = {
        method: 'GET',
        json: true,
        //https://srv6.akinator.com:9126/ws/list?callback=&session=323&signature=343571160&step=0&answer=0
        uri: `https://${id}/ws/list?callback=&session=${session}&signature=${signature}&step=${step}`,
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

    if(callback != null) {
        if (json.completion === 'OK') {
            try {
                callback(jsonComplete(json, step));
            } catch (e) {
                console.error(e);
                callback(json);
            }
        } else if (json.completion === 'KO - SERVER DOWN') {
            callback(null, `Akinator servers are down for the "${region}" region. Check back later.` + json.completion);
        } else if (json.completion === 'KO - TECHNICAL ERROR') {
            callback(null, `Akinator's servers have had a technical error for the "${region}" region. Check back later.` + json.completion);
        } else if (json.completion === 'KO - INCORRECT PARAMETER') {
            callback(null, `You inputted a wrong paramater, this could be session, region, or signature.` + json.completion);
        } else if (json.completion === 'KO - TIMED OUT') {
            callback(null, 'Your Akinator session has timed out.' + json.completion);
        } else {
            callback(null, 'Unknown error has occured. Server response: ' + json.completion);
        }
    }

    else {
        return new Promise( (resolve, reject) => {
            if (json.completion === 'OK') {
                try {
                    resolve(jsonComplete(json, step));
                } catch (e) {
                    console.error(e);
                    reject(json);
                }
            } else if (json.completion === 'KO - SERVER DOWN') {
                reject(`Akinator servers are down for the "${region}" region. Check back later.` + json.completion);
            } else if (json.completion === 'KO - TECHNICAL ERROR') {
                reject(`Akinator's servers have had a technical error for the "${region}" region. Check back later.` + json.completion);
            } else if (json.completion === 'KO - INCORRECT PARAMETER') {
                reject(`You inputted a wrong paramater, this could be session, region, or signature.` + json.completion);
            } else if (json.completion === 'KO - TIMED OUT') {
                reject('Your Akinator session has timed out.' + json.completion);
            } else {
                reject('Unknown error has occured. Server response: ' + json.completion);
            }
        });
    }
}


/**
 * parses out the json info
 * @param json the json information from the request
 * @param step the step akinator is working on.
 */
function jsonComplete(json, step) {
    let ans = []
    for (let i = 0; i < json.parameters.elements.length; i++) {
        ans.push(json.parameters.elements[i].element);
    }

    return {
        "answers": ans,
        "currentStep": step,
        "nextStep": step+1,
        "guessCount": json.parameters.NbObjetsPertinents //number of guesses akinator holds
    };
}
