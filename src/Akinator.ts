
import { request, regionURL, AkinatorAPIError, getSession, guess } from './functions';
import { jQuery, region, regions } from './constants/Client';
import { HttpsProxyAgent, HttpsProxyAgentOptions } from 'https-proxy-agent';
import { configOptions } from './functions/Request';

interface AkinatorConstructor {
  region: region
  childMode?: boolean
  proxyOptions?: string | HttpsProxyAgentOptions;
}

const answers = [0, 1, 2, 3, 4] as const;
type answerID = (typeof answers)[number];

export default class Akinator {
  currentStep: number;
  region: region;
  uri: string | undefined;
  urlApiWs: string | undefined;
  uriObj: { uid: string, frontaddr: string } | Error | undefined;
  noUri: string;
  noSession: string;
  session: string | undefined;
  progress: number;
  childMode: { childMod: boolean; softConstraint: string; questionFilter: string; };
  answers: ('Yes' | 'No' | 'Don\'t Know' | 'Probably' | 'Probably not')[] | guess[];
  uid: string | undefined;
  frontaddr: string | undefined;
  signature: string | undefined;
  question: string | undefined;
  challenge_auth: string | undefined;
  guessCount: number;
  config: configOptions;
  constructor({ region, childMode, proxyOptions }: AkinatorConstructor) {
    if (!region || !regions.includes(region)) {
      throw new Error('Please specify a correct region. You can import regions I support or view docs. Then use it like so: new Aki({ region })');
    }
    this.currentStep = 0;
    this.region = region;
    this.uri = undefined;
    this.urlApiWs = undefined;
    this.noUri = 'Could not find the uri or UrlApiWs. This most likely means that you have not started the game!';
    this.noSession = 'Could not find the game session. Please make sure you have started the game!';
    this.progress = 0.00;
    this.guessCount = 0;
    this.childMode = {
      childMod: childMode === true,
      softConstraint: childMode === true ? 'ETAT%3D%27EN%27' : '',
      questionFilter: childMode === true ? 'cat%3D1' : '',
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
  async start(): Promise<void | Error> {
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
    }
  }

  /*
   * Continue to guess after a "win"(e.g contine guession after a wrong result).
   */
  async continue(): Promise<void | Error> {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj || !this.session || !this.signature) throw new Error(this.noSession);

    const query = new URLSearchParams();
    query.append('callback', jQuery + new Date().getTime());

    if (this.childMode.childMod) {
      query.append('childMod', this.childMode.childMod.toString());
    }

    query.append('session', this.session);
    query.append('signature', this.signature);
    query.append('step', this.currentStep.toString());
    query.append('step', this.currentStep.toString());
    query.append('question_filter', this.childMode.questionFilter);


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
    }
  }

  /**
   * Gets the next question for the akinator session.
   * @param {answerID} answerID the answer to the question
   */
  async step(answerID: answerID): Promise<void | Error> {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj) throw new Error(this.noSession);

    const url = `${this.uri}/answer_api?callback=${jQuery + new Date().getTime()}&urlApiWs=${this.urlApiWs}&childMod=${this.childMode.childMod}&session=${this.session}&signature=${this.signature}&step=${this.currentStep}&answer=${answerID}&frontaddr=${this.frontaddr}&question_filter=${this.childMode.questionFilter}`;
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
    }
  }

  /**
   * Reverts the game back a previous step.
   */
  async back(): Promise<void | Error> {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj) throw new Error(this.noSession);

    const url = `${this.urlApiWs}/cancel_answer?&callback=${jQuery + new Date().getTime()}&session=${this.session}&childMod=${this.childMode.childMod}&signature=${this.signature}&step=${this.currentStep}&answer=-1&question_filter=${this.childMode.questionFilter}`;
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
    }

    (await this.win())
  }

  /**
   * The akinator attempts to make a guess and win the game.
   */
  async win(): Promise<void | Error> {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj) throw new Error(this.noSession);

    const url = `${this.urlApiWs}/list?callback=${jQuery + new Date().getTime()}&signature=${this.signature}${this.childMode.childMod === true ? `&childMod=${this.childMode.childMod}` : ''}&step=${this.currentStep}&session=${this.session}`;
    const result = await request(url, 'elements', this.region, this.config);
    if (result instanceof AkinatorAPIError) {
      throw result;
    }

    const { parameters } = result;

    if ('elements' in parameters) {
      this.answers = (parameters.elements || []).map((ele) => ele.element);

      for (let i = 0; i < this.answers.length; i += 1) {
        this.answers[i].nsfw = this.answers[i].pseudo.toLowerCase() == 'pornstar' || this.answers[i].description.toLowerCase().includes('porn');
      }
      this.guessCount = parseInt(parameters.NbObjetsPertinents, 10);
    }
  }
}
