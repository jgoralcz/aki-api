import axios, { AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { issues, region } from '../constants/Client';
import * as os from 'os';

interface AkinatorHeaders {
  Accept: string,
  'Accept-Encoding': string,
  'Accept-Language': string,
  'User-Agent': string,
  'x-requested-with': string
}

interface AkinatorParams {
  gzip: boolean,
  resolveWithFullResponse: boolean,
  validateStatus: () => boolean,
  timeout: number
}

interface AkinatorPromise {
  status: number,
  data: string,
}

export type guess = {
  id: string,
  name: string,
  id_base: string,
  proba: string,
  absolute_picture_path: string
  award_id: string
  corrupt: string
  description: string
  picture_path: string
  pseudo: string
  ranking: string
  relative: string
  valide_contrainte: string
  nsfw?: boolean
}

export type AkinatorResultParams = {
  // list of answers
  NbObjetsPertinents: string
  elements: {
    element: guess
  }[]
} | {
  // starting
  identification: {
    challenge_auth: string
    channel: number
    session: string
    signature: string
  },
  step_information: {
    answers: [{ answer: 'Yes' }, { answer: 'No' }, { answer: 'Don\'t Know' }, { answer: 'Probably' }, { answer: 'Probably not' }]
    infogain: string
    progression: string
    question: string
    questionid: string
    step: string
  }
} | {
  // question
  answers: [{ answer: 'Yes' }, { answer: 'No' }, { answer: 'Don\'t Know' }, { answer: 'Probably' }, { answer: 'Probably not' }]
  infogain: string
  options: string[] // not sure
  progression: string
  question: string
  questionid: string
  status_minibase: string
  step: string
}

interface AkinatorResult {
  completion: string,
  parameters: AkinatorResultParams
}

interface AkinatorThemesToPlay {
  translated_theme_name: string;
  urlWs: string;
  subject_id: string;
}

interface AkinatorSubjects {
  characters: number,
  Objects: number,
  Animals: number
  [key: string]: number;
}

type checkParamProperty = 'elements' | 'answers' | 'identification';

const params: AkinatorParams = Object.freeze({
  gzip: true,
  resolveWithFullResponse: true,
  validateStatus: () => true,
  timeout: 10000,
});

// Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:10.0) Gecko/20100101 Firefox/10.0

const headers: AkinatorHeaders = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': `Mozilla/5.0 (${os.type().replace('_', ' ')} ${os.release()}; ${os.platform()}; ${os.arch()}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36`,
  'x-requested-with': 'XMLHttpRequest',
};
const subject_ids : AkinatorSubjects = {
  characters: 1,
  Objects: 2,
  Animals: 14
}


interface AkiURL {
  url: string,
  urlWs: string
}

/**
 * gets the server based on the provided region, so we don't rely on hard coded values.
 * @param {string} region the requested region to be parsed
 * @return {object} obj with url and urlWs or undefined
 */
const getServer = async (region: region): Promise<AkiURL | undefined> => {
  try {
    const split = region.split('_');
    const [language, themeName] = split;

    const url = `https://${language}.akinator.com`;
    const { data } = await axios.get(url);

    const regex = /\[{"translated_theme_name":"[\s\S]*","urlWs":"https:\\\/\\\/srv[0-9]+\.akinator\.com:[0-9]+\\\/ws","subject_id":"[0-9]+"}]/gim;
    const parsed : AkinatorThemesToPlay[] = JSON.parse(data.match(regex));

    if (!parsed || !parsed[0] || !parsed[0].urlWs || parsed.length <= 0) return undefined;

    const _themeName : keyof AkinatorSubjects = themeName ? themeName.replace(themeName.charAt(0), themeName.charAt(0).toUpperCase()) : 'characters';

    const subjectId = subject_ids[_themeName];

    const found = parsed.find(theme => parseInt(theme.subject_id) === subjectId);

    const obj: AkiURL = {
      url,
      urlWs: themeName && found && found.urlWs ? found.urlWs : parsed[0].urlWs,
    };

    return obj;
  } catch (error) {
    console.error(error);
  }
  return undefined;
};

export class AkinatorAPIError extends Error {
  constructor(data: AkinatorResult, region: string) {
    super(`A problem occurred with making the request data: ${data}: region: ${region}`);

    this.message = this.mapError(data.completion, region);
  }

  private mapError(c: string, region: string): string {
    if (!c) return `A problem occurred with making the request.\nRequest Body: ${c}`;

    switch (c) {
      case 'KO - SERVER DOWN': return `Akinator servers are down for the "${region}" region. Check back later. ${c}`;

      case 'KO - TECHNICAL ERROR': return `Akinator's servers have had a technical error for the "${region}" region. Check back later. ${c}`;

      case 'KO - INCORRECT PARAMETER': return `You inputted a wrong paramater, this could be session, region, or signature. ${c}`;

      case 'KO - TIMEOUT': return `Your Akinator session has timed out. ${c}`;

      case 'WARN - NO QUESTION': return `No question found. ${c}`;

      case 'KO - MISSING PARAMETERS': return `Akinator needs more parameters. Please make an issue at: ${issues}`;
      
      default: return `Unknown error has occurred. Server response: ${c}`;
    }
  }
}

export type configOptions = {
  httpsAgent: HttpsProxyAgent | undefined;
  proxy: boolean;
} | undefined;

// example output: jQuery331023608747682107778_1615444627875({"completion":"OK","parameters":{"identification":{"channel":0,"session":"459","signature":"223731835","challenge_auth":"8ebe521c-5991-4625-b081-6066352649e5"},"step_information":{"question":"Does your character really exist?","answers":[{"answer":"Yes"},{"answer":"No"},{"answer":"Don't know"},{"answer":"Probably"},{"answer":"Probably not"}],"step":"0","progression":"0.00000","questionid":"266","infogain":"0.607602"}}}
export const request = async (url: string, checkParamProperty: checkParamProperty, region: region, config: configOptions): Promise<AkinatorAPIError | AkinatorResult> => {
  const axiosConfig = (config || {}) as AxiosRequestConfig;
  
  const { status, data } = await axios.get<number, AkinatorPromise>(url, { headers, params, ...axiosConfig });

  if (status !== 200 || !data) {
    throw new Error(`A problem occurred with making the request. status: ${status}`);
  }

  const beginningParse = data.indexOf('(');
  const jsonString = data.substring(beginningParse + 1, data.length - 1);
  const result: AkinatorResult = JSON.parse(jsonString);

  if (!result || result.completion != 'OK' || !(checkParamProperty in result.parameters)) {
    throw new AkinatorAPIError(result, region);
  }

  return result;
};

/**
 * Returns the url from the correct region.
 * @param userRegion the region provided
 * @returns {Promise<AkiURL>} the generated url for that region
 */
export const regionURL = async (userRegion: region): Promise<AkiURL | undefined> => getServer((userRegion.toLowerCase()) as region);
