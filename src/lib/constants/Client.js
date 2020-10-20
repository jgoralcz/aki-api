const patternSession = new RegExp("var uid_ext_session = '(.*)';\\n.*var frontaddr = '(.*)';");
const issues = 'https://github.com/jgoralcz/aki-api/issues';
const jQuery = 'jQuery331023608747682107778_';
const regions = [
  'en',
  'en_objects',
  'en_animals',
  'ar',
  'cn',
  'de',
  'de_animals',
  'es',
  'es_animals',
  'fr',
  'fr_objects',
  'fr_animals',
  'il',
  'it',
  'it_animals',
  'jp',
  'jp_animals',
  'kr',
  'nl',
  'pl',
  'pt',
  'ru',
  'tr',
  'id',
];

module.exports = {
  patternSession,
  issues,
  jQuery,
  regions,
};
