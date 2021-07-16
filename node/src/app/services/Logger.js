// eslint-disable-next-line import/no-extraneous-dependencies
const debug = require('debug');

class Logger {
  static getError() {
    return debug('app:error');
  }
}

module.exports = Logger;
