
import { request, AkinatorAPIError } from './functions';
import { region, regions, noSessionMsg, noUriMsg } from './constants/Client';
import { HttpsProxyAgent, HttpsProxyAgentOptions } from 'https-proxy-agent';
import axios, { AxiosRequestConfig } from 'axios';
import { decode as decodeHTML } from 'html-entities';
import { AkinatorResult, AkinatorResultGuess } from './functions/Request';
import * as FormData from 'form-data';

interface AkinatorConstructor {
  region: region
  childMode?: boolean
  proxyOptions?: string | HttpsProxyAgentOptions<any>; // TODO: fix any type
}

export enum answers {
  Yes,
  No,
  DontKnow,
  Probably,
  ProbablyNot
}

export default class Akinator {
  currentStep: number;
  region: region;
  uri?: string;
  session?: string;
  progress: number;
  childMode: boolean;
  step_last_proposition: string;

  answers: string[]
  /** @deprecated use the `guessCount` property from `start()` and `step()` instead */
  guessCount: number;
  /** @deprecated use the `question` property from `start()` and `step()` instead */
  question?: string;

  signature?: string;
  config: AxiosRequestConfig;
  guess?: AkinatorResultGuess;

  constructor({ region, childMode, proxyOptions }: AkinatorConstructor) {
    if (!region || !regions.includes(region)) {
      throw new Error('Please specify a correct region. You can import regions I support or view docs. Then use it like so: new Aki({ region })');
    }

    this.currentStep = 0;
    this.region = region;
    this.uri = undefined;
    this.guess = undefined;
    this.progress = 0.00;
    this.step_last_proposition = '';
    this.guessCount = 0;
    this.childMode = childMode === true;
    this.uri = `https://${this.region}.akinator.com`;

    if (proxyOptions) {
      this.config = {
        httpsAgent: new HttpsProxyAgent(proxyOptions),
        proxy: false,
      } as AxiosRequestConfig;
    } else {
      this.config = {} as AxiosRequestConfig;
    }

    this.question = '';
    this.answers = [];
  }

  /**
  * Starts the akinator session and game.
  */
  async start() {
    const url = `${this.uri}/game`;

    const formData = new FormData();
    formData.append('sid', '1');
    formData.append('cm', this.childMode.toString());

    const { status, data: text } = await axios.postForm(url, formData, this.config);
    if (status !== 200) {
      throw new AkinatorAPIError('starting session error...', this.region);
    }
    this.question = text.match(/<p class="question-text" id="question-label">(.+)<\/p>/)[1];
    this.session = text.match(/session: '(.+)'/)[1];
    this.signature = text.match(/signature: '(.+)'/)[1];
    this.answers = [
      decodeHTML(text.match(/<a class="li-game" href="#" id="a_yes" onclick="chooseAnswer\(0\)">(.+)<\/a>/)[1]),
      decodeHTML(text.match(/<a class="li-game" href="#" id="a_no" onclick="chooseAnswer\(1\)">(.+)<\/a>/)[1]),
      decodeHTML(text.match(/<a class="li-game" href="#" id="a_dont_know" onclick="chooseAnswer\(2\)">(.+)<\/a>/)[1]),
      decodeHTML(text.match(/<a class="li-game" href="#" id="a_probably" onclick="chooseAnswer\(3\)">(.+)<\/a>/)[1]),
      decodeHTML(text.match(/<a class="li-game" href="#" id="a_probaly_not" onclick="chooseAnswer\(4\)">(.+)<\/a>/)[1])
    ];

    return this;
  }

  /*
   * Continue to guess after a "win" (contine to play after a wrong result).
   */
  async continue(): Promise<AkinatorResult | AkinatorAPIError> {
    if (!this.uri) {
      throw new Error(noUriMsg);
    }
    if (!this.session || !this.signature) {
      throw new Error(noSessionMsg);
    }
    const formData = new FormData();
    formData.append('step', this.currentStep.toString());
    formData.append('progression', this.progress.toString());
    formData.append('sid', '1');
    formData.append('cm', this.childMode.toString());
    formData.append('session', this.session);
    formData.append('signature', this.signature);

    const url = `${this.uri}/exclude`;
    const result = await request(url, formData, this.config) as AkinatorResult;
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    this.progress = parseFloat(result.progression);
    this.question = result.question;
    this.currentStep = parseInt(result.step, 10);

    return result;
  }

  /**
   * Gets the next question for the akinator session.
   * @param {answers} answerID the answer to the question
   */
  async step(answer: answers): Promise<AkinatorResult | AkinatorResultGuess | AkinatorAPIError> {
    if (!this.uri) {
      throw new Error(noUriMsg);
    }
    if (!this.session || !this.signature) {
      throw new Error(noSessionMsg);
    }

    const formData = new FormData();
    formData.append('step', this.currentStep.toString());
    formData.append('progression', this.progress.toString());
    formData.append('sid', '1');
    formData.append('cm', this.childMode.toString());
    formData.append('answer', answer.toString());
    formData.append('step_last_proposition', '');
    formData.append('session', this.session);
    formData.append('signature', this.signature);

    const url = `${this.uri}/answer`;

    const result = await request(url, formData, this.config);

    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const guess = result as AkinatorResultGuess;

    // akinator has guessed
    if (guess.id_base_proposition) {
      this.guess = guess;
      return guess;
    }

    // a normal step

    const akinatorResult = result as AkinatorResult;

    this.currentStep = parseInt(akinatorResult.step, 10);
    this.question = akinatorResult.question;
    this.progress = parseFloat(akinatorResult.progression);

    return akinatorResult;
  }

  /**
   * Reverts the game back a previous step.
   */
  async back(): Promise<AkinatorResult | AkinatorAPIError> {
    if (!this.uri) {
      throw new Error(noUriMsg);
    }
    if (!this.session || !this.signature) {
      throw new Error(noSessionMsg);
    }

    const formData = new FormData();
    formData.append('step', this.currentStep.toString());
    formData.append('progression', this.progress.toString());
    formData.append('sid', '1');
    formData.append('cm', this.childMode.toString());
    formData.append('session', this.session);
    formData.append('signature', this.signature);

    const url = `${this.uri}/cancel_answer`;

    const result = await request(url, formData, this.config) as AkinatorResult;
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    this.currentStep = parseInt(result.step, 10);
    this.progress = parseFloat(result.progression);
    this.question = result.question;

    return result;
  }
}
