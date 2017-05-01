// check out https://github.com/visionmedia/node-pwd

/**
 * Module dependencies.
 */

var Promise = require("bluebird");
var crypto = Promise.promisifyAll(require('crypto'));
var R = require('ramda');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 5000;

/**
 * Hashes a password &
 * generate a salt for password
 *
 * @param {String} password to hash
 * @returns Promise
 * @api public
 */

exports.createHash = function (pwd) {
  return crypto.randomBytesAsync(len).bind(this)
    .then(function (salt) {
      this.salt = salt.toString('base64');
      return crypto.pbkdf2Async(pwd, this.salt, iterations, len);
    })
    .then(function (hash) {
      return {
        salt: this.salt,
        hash: hash.toString('base64')
      };
    });
};

/***
 * Get Hash with provided password and salt
 * @param pwd
 * @param salt
 * @returns {*}
 */
exports.getHash = function (pwd, salt) {
  return crypto.pbkdf2Async(pwd, salt, iterations, len)
    .then(function (hash) {
      return (hash.toString('base64'));
    });
};

/**
 * Set length to `n`.
 *
 * @param {Number} n
 * @api public
 */

exports.length = function (n) {
  if (0 == arguments.length) return len;
  len = n;
};

/**
 * Set iterations to `n`.
 *
 * @param {Number} n
 * @api public
 */

exports.iterations = function (n) {
  if (0 == arguments.length) return iterations;
  iterations = n;
};
