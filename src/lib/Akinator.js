const request = require('../lib/functions/Request');
const getURL = require('../lib/functions/GetURL');
const { jQuery } = require('../lib/constants/Client');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');
const getSession = require('../lib/functions/GetSession');

module.exports = class Akinator {
  constructor(region) {
    this.currentStep = 0;
    this.region = region;
    this.gameEnv = getURL(this.region);
    this.uri = this.gameEnv.uri;
    this.urlApiWs = this.gameEnv.urlApiWs;
    this.uriObj = null;
    this.noSession = 'Could not find the game session. Please make sure you have started the game!';
    this.progress = 0.00;

    this.queston = '';
    this.answers = [];
  }

  /**
  * Starts the akinator session and game.
  */
  async start() {
    this.uriObj = await getSession();
    this.uid = this.uriObj.uid;
    this.frontaddr = this.uriObj.frontaddr;

    const result = await request(`https://${this.uri}/new_session?callback=${jQuery + new Date().getTime()}&urlApiWs=https://${this.urlApiWs}/ws&partner=1&player=website-desktop&uid_ext_session=${this.uid}&frontaddr=${this.frontaddr}&constraint=ETAT%%3C%%3E%%27AV%%27&constraint=ETAT<>'AV'`);
    const { body, statusCode } = result;

    if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.step_information.question) {
      akinatorAPIErrors(body, this.region);
      return;
    }

    this.session = body.parameters.identification.session;
    this.signature = body.parameters.identification.signature;
    this.question = body.parameters.step_information.question;
    this.challenge_auth = body.parameters.identification.challenge_auth;
    this.answers = body.parameters.step_information.answers.map(ans => ans.answer);
  }

  /**
   * Gets the next question for the akinator session.
   * @param {BigInteger} answerId the answer to the question
   */
  async step(answerId) {
    if (!this.uriObj) throw new Error(this.noSession);

    const result = await request(`https://${this.uri}/answer_api?callback=${jQuery + new Date().getTime()}&urlApiWs=https://${this.urlApiWs}/ws&session=${this.session}&signature=${this.signature}&step=${this.currentStep}&answer=${answerId}&frontaddr=${this.frontaddr}`);
    const { body, statusCode } = result;

    if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.question) {
      akinatorAPIErrors(body, this.region);
      return;
    }

    this.currentStep = this.currentStep + 1;
    this.progress = body.parameters.progression;
    this.question = body.parameters.question;
    this.answers = body.parameters.answers.map(ans => ans.answer);
  }

  /**
   * Reverts the game back a previous step.
   */
  async back() {
    if (!this.uriObj) throw new Error(this.noSession);

    const result = await request(`https://${this.urlApiWs}/ws/cancel_answer?&callback=${jQuery + new Date().getTime()}&session=${this.session}&signature=${this.signature}&step=${this.currentStep}&answer=-1`);
    const { body, statusCode } = result;

    if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.question) {
      akinatorAPIErrors(body, this.region);
      return;
    }

    this.currentStep = this.currentStep - 1;
    this.progress = body.parameters.progression;
    this.question = body.parameters.question;
    this.answers = body.parameters.answers.map(ans => ans.answer);
  }

  /**
   * The akinator attempts to make a guess and win the game.
   */
  async win() {
    if (!this.uriObj) throw new Error(this.noSession);

    const result = await request(`https://${this.urlApiWs}/ws/list?callback=${jQuery + new Date().getTime()}&signature=${this.signature}&step=${this.currentStep}&session=${this.session}`);
    const { body, statusCode } = result;

    if (!statusCode || statusCode !== 200 || !body || body.completion !== 'OK' || !body.parameters || !body.parameters.elements) {
      akinatorAPIErrors(body, this.region);
      return;
    }

    this.answers = (body.parameters.elements || []).map(ele => ele.element);
    this.guessCount = body.parameters.NbObjetsPertinents;
  }
};
