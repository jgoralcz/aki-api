
import { request, regionURL, AkinatorAPIError, getSession, guess } from './functions';
import { jQuery, region, regions, noSessionMsg, noUriMsg } from './constants/Client';
import { HttpsProxyAgent, HttpsProxyAgentOptions } from 'https-proxy-agent';
import { configOptions } from './functions/Request';
import { constants } from 'buffer';

interface question {
  question: string,
  answers: ('Yes' | 'No' | 'Don\'t Know' | 'Probably' | 'Probably not' | string)[]
}

interface winResult {
  guessCount: number,
  guesses: guess[]
}

interface AkinatorConstructor {
  region: region
  childMode?: boolean
  proxyOptions?: string | HttpsProxyAgentOptions;
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
  uri: string | undefined;
  urlApiWs: string | undefined;
  uriObj: { uid: string, frontaddr: string } | undefined;
  session: string | undefined;
  progress: number;
  childMode: { childMod: boolean; softConstraint: string; questionFilter: string; };

  /** @deprecated use the `guesses` property from `win()` instead. */
  answers: ('Yes' | 'No' | 'Don\'t Know' | 'Probably' | 'Probably not')[] | guess[];
  /** @deprecated use the `guessCount` property from `start()` and `step()` instead */
  guessCount: number;
  /** @deprecated use the `question` property from `start()` and `step()` instead */
  question: string | undefined;

  uid: string | undefined;
  frontaddr: string | undefined;
  signature: string | undefined;
  challenge_auth: string | undefined;
  config: configOptions;

  constructor({ region, childMode, proxyOptions }: AkinatorConstructor) {
    if (!region || !regions.includes(region)) {
      throw new Error('Please specify a correct region. You can import regions I support or view docs. Then use it like so: new Aki({ region })');
    }

    this.currentStep = 0;
    this.region = region;
    this.uri = undefined;
    this.urlApiWs = undefined;
    this.progress = 0.00;
    this.guessCount = 0;
    this.childMode = {
      childMod: childMode === true,
      softConstraint: childMode === true ? encodeURIComponent("ETAT='EN'") : '',
      questionFilter: childMode === true ? encodeURIComponent('cat=1') : '',
    };

    if (proxyOptions) {
      this.config = {
        httpsAgent: new HttpsProxyAgent(proxyOptions),
        proxy: false,
      }
    }

    this.question = '';
    this.answers = [];
  }

  /**
  * Starts the akinator session and game.
  */
  async start(): Promise<question> {
    const server = await regionURL(this.region);
    if (!server) throw new Error(`Could not find a server matching the region ${this.region}`);

    this.uri = server.url;
    this.urlApiWs = server.urlWs;
    this.uriObj = await getSession();
    if (this.uriObj instanceof Error) {
      throw this.uriObj;
    }

    this.uid = this.uriObj.uid;
    this.frontaddr = this.uriObj.frontaddr;

    const url = `${this.uri}/new_session?callback=${jQuery + new Date().getTime()}&urlApiWs=${this.urlApiWs}&partner=1&childMod=${this.childMode.childMod}&player=website-desktop&uid_ext_session=${this.uid}&frontaddr=${this.frontaddr}&constraint=ETAT<>'AV'&soft_constraint=${this.childMode.softConstraint}&question_filter=${this.childMode.questionFilter}`;
    const result = await request(url, 'identification', this.region, this.config);
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const { parameters } = result;

    if ('identification' in parameters) {
      this.session = parameters.identification.session;
      this.signature = parameters.identification.signature;
      this.question = parameters.step_information.question;
      this.challenge_auth = parameters.identification.challenge_auth;
      this.answers = parameters.step_information.answers.map((ans) => ans.answer);

      return {
        answers: parameters.step_information.answers.map((ans) => ans.answer),
        question: parameters.step_information.question
      }
    } else {
      throw new AkinatorAPIError(result, this.region);
    }
  }

  /*
   * Continue to guess after a "win" (contine to play after a wrong result).
   */
  async continue(): Promise<question> {
    if (!this.uri || !this.urlApiWs) throw new Error(noUriMsg);
    if (!this.uriObj || !this.session || !this.signature) throw new Error(noSessionMsg);

    const query = new URLSearchParams({
      callback: jQuery + new Date().getTime(),
      session: this.session,
      signature: this.signature,
      step: this.currentStep.toString(),
      question_filter: this.childMode.questionFilter
    });

    if (this.childMode.childMod) {
      query.append('childMod', this.childMode.childMod.toString());
    }

    const url = `${this.urlApiWs}/list/exclusion?${query.toString()}`;
    const result = await request(url, 'answers', this.region, this.config);
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const { parameters } = result;

    if ('progression' in parameters) {
      this.currentStep += 1;
      this.progress = parseFloat(parameters.progression);
      this.question = parameters.question;
      this.answers = parameters.answers.map((ans) => ans.answer);

      return {
        answers: parameters.answers.map((ans) => ans.answer),
        question: parameters.question
      }
    } else {
      throw new AkinatorAPIError(result, this.region);
    }
  }

  /**
   * Gets the next question for the akinator session.
   * @param {answers} answerID the answer to the question
   */
  async step(answer: answers): Promise<question> {
    if (!this.uri || !this.urlApiWs) throw new Error(noUriMsg);
    if (!this.uriObj || !this.session || !this.signature || !this.frontaddr) throw new Error(noSessionMsg);

    const query = new URLSearchParams({
      callback: jQuery + new Date().getTime(),
      urlApiWs: this.urlApiWs,
      childMod: this.childMode.childMod.toString(),
      session: this.session,
      signature: this.signature,
      step: this.currentStep.toString(),
      answer: answer.toString(),
      frontaddr: this.frontaddr,
      question_filter: this.childMode.questionFilter
    })

    const url = `${this.uri}/answer_api?${query.toString()}`;

    const result = await request(url, 'answers', this.region, this.config);

    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const { parameters } = result;

    if ('progression' in parameters) {
      this.currentStep += 1;
      this.progress = parseFloat(parameters.progression);
      this.question = parameters.question;
      this.answers = parameters.answers.map((ans) => ans.answer);

      return {
        answers: parameters.answers.map((ans) => ans.answer),
        question: parameters.question
      }
    } else {
      throw new AkinatorAPIError(result, this.region);
    }
  }

  /**
   * Reverts the game back a previous step.
   */
  async back(): Promise<question> {
    if (!this.uri || !this.urlApiWs) throw new Error(noUriMsg);
    if (!this.uriObj || !this.session || !this.signature) throw new Error(noSessionMsg);

    const query = new URLSearchParams({
      callback: jQuery + new Date().getTime(),
      session: this.session,
      childMod: this.childMode.childMod.toString(),
      signature: this.signature,
      step: this.currentStep.toString(),
      answer: '-1',
      question_filter: this.childMode.questionFilter
    })

    const url = `${this.urlApiWs}/cancel_answer?${query.toString()}`;

    const result = await request(url, 'answers', this.region, this.config);
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const { parameters } = result;

    if ('progression' in parameters) {
      this.currentStep -= 1;
      this.progress = parseFloat(parameters.progression);
      this.question = parameters.question;
      this.answers = parameters.answers.map((ans) => ans.answer);

      return {
        answers: parameters.answers.map((ans) => ans.answer),
        question: parameters.question
      }
    } else {
      throw new AkinatorAPIError(result, this.region);
    }
  }

  /**
   * The akinator attempts to make a guess and win the game.
   */
  async win(): Promise<winResult> {
    if (!this.uri || !this.urlApiWs) throw new Error(noUriMsg);
    if (!this.uriObj || !this.signature || !this.session) throw new Error(noSessionMsg);

    const query = new URLSearchParams({
      callback: jQuery + new Date().getTime(),
      signature: this.signature,
      step: this.currentStep.toString(),
      session: this.session
    })

    const url = `${this.urlApiWs}/list?${query.toString()}`;
    const result = await request(url, 'elements', this.region, this.config);
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const { parameters } = result;

    if ('elements' in parameters) {
      const answers = (parameters.elements || []).map((ele) => ele.element);

      for (let i = 0; i < answers.length; i += 1) {
        answers[i].nsfw = answers[i].valide_contrainte == '0';
      }

      const guessCount = parseInt(parameters.NbObjetsPertinents, 10)
      this.answers = answers;
      this.guessCount = guessCount;

      return {
        guesses: answers,
        guessCount: guessCount
      };
    } else {
      throw new AkinatorAPIError(result, this.region);
    }
  }
}
