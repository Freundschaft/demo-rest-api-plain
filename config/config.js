process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || './config/config-files';
var config = require('config');

module.exports = {
  getEnv: function () {
    return process.env.NODE_ENV || 'development';
  },
  isInDev: function () {
    return this.getEnv() === 'development';
  },
  isInTest: function () {
    return typeof global.it === 'function';
  },
  loggingEnabled: function () {
    return !process.env.DISABLE_LOGGING;
  },
  getConfig: function () {
    return config;
  }
};
