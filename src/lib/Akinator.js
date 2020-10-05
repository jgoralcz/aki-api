const request = require('./functions/Request');
const getURL = require('./functions/GetURL');
const { jQuery } = require('./constants/Client');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');
const getSession = require('./functions/GetSession');

module.exports = class Akinator {
  constructor(region, childMode) {
    this.currentStep = 0;
    this.region = region;
    this.uri = undefined;
    this.urlApiWs = undefined;
    this.uriObj = null;
    this.noUri = 'Could not find the uri or UrlApiWs. This most likely means that you have not started the game!';
    this.noSession = 'Could not find the game session. Please make sure you have started the game!';
    this.progress = 0.00;
    this.childMode = {
      childMod: childMode === true,
      softConstraint: childMode === true ? 'ETAT%3D%27EN%27' : '',
      questionFilter: childMode === true ? 'cat%3D1' : '',
    };

    this.queston = '';
    this.answers = [];
  }

  /**
  * Starts the akinator session and game.
  */
  async start() {
    const server = await getURL(this.region);
    if (!server) throw new Error(`Could not find a server matching the region ${this.region}`);

    this.uri = server.url;
    this.urlApiWs = server.urlWs;
    this.uriObj = await getSession();
    this.uid = this.uriObj.uid;
    this.frontaddr = this.uriObj.frontaddr;

    const { data, status } = await request(`${this.uri}/new_session?callback=${jQuery + new Date().getTime()}&urlApiWs=${this.urlApiWs}&partner=1&childMod=${this.childMode.childMod}&player=website-desktop&uid_ext_session=${this.uid}&frontaddr=${this.frontaddr}&constraint=ETAT<>'AV'&soft_constraint=${this.childMode.softConstraint}&question_filter=${this.childMode.questionFilter}`);

    if (!status || status !== 200 || !data || data.completion !== 'OK' || !data.parameters || !data.parameters.step_information.question) {
      akinatorAPIErrors(data, this.region);
      return;
    }

    this.session = data.parameters.identification.session;
    this.signature = data.parameters.identification.signature;
    this.question = data.parameters.step_information.question;
    this.challenge_auth = data.parameters.identification.challenge_auth;
    this.answers = data.parameters.step_information.answers.map((ans) => ans.answer);
  }

  /**
   * Gets the next question for the akinator session.
   * @param {BigInteger} answerId the answer to the question
   */
  async step(answerId) {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj) throw new Error(this.noSession);

    const { data, status } = await request(`${this.uri}/answer_api?callback=${jQuery + new Date().getTime()}&urlApiWs=${this.urlApiWs}&childMod=${this.childMode.childMod}&session=${this.session}&signature=${this.signature}&step=${this.currentStep}&answer=${answerId}&frontaddr=${this.frontaddr}&question_filter=${this.childMode.questionFilter}`);

    if (!status || status !== 200 || !data || data.completion !== 'OK' || !data.parameters || !data.parameters.question) {
      akinatorAPIErrors(data, this.region);
      return;
    }

    this.currentStep += 1;
    this.progress = data.parameters.progression;
    this.question = data.parameters.question;
    this.answers = data.parameters.answers.map((ans) => ans.answer);
  }

  /**
   * Reverts the game back a previous step.
   */
  async back() {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj) throw new Error(this.noSession);

    const { data, status } = await request(`${this.urlApiWs}/cancel_answer?&callback=${jQuery + new Date().getTime()}&session=${this.session}&childMod=${this.childMode.childMod}&signature=${this.signature}&step=${this.currentStep}&answer=-1&question_filter=${this.childMode.questionFilter}`);

    if (!status || status !== 200 || !data || data.completion !== 'OK' || !data.parameters || !data.parameters.question) {
      akinatorAPIErrors(data, this.region);
      return;
    }

    this.currentStep -= 1;
    this.progress = data.parameters.progression;
    this.question = data.parameters.question;
    this.answers = data.parameters.answers.map((ans) => ans.answer);
  }

  /**
   * The akinator attempts to make a guess and win the game.
   */
  async win() {
    if (!this.uri || !this.urlApiWs) throw new Error(this.noUri);
    if (!this.uriObj) throw new Error(this.noSession);

    const { data, status } = await request(`${this.urlApiWs}/list?callback=${jQuery + new Date().getTime()}&signature=${this.signature}${this.childMode === true ? `&childMod=${this.childMode}` : ''}&step=${this.currentStep}&session=${this.session}`);

    if (!status || status !== 200 || !data || data.completion !== 'OK' || !data.parameters || !data.parameters.elements) {
      akinatorAPIErrors(data, this.region);
      return;
    }

    this.answers = (data.parameters.elements || []).map((ele) => ele.element);
    for (let i = 0; i < this.answers.length; i += 1) {
      this.answers[i].nsfw = ['x', 'pornstar'].includes((this.answers[i].pseudo || '').toLowerCase());
    }

    this.guessCount = data.parameters.NbObjetsPertinents;
  }
};