var config = require('../../config/config').getConfig(),
  R = require('ramda'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  jwt = require('jsonwebtoken'),
  crypto = require('crypto');

const MINIMUM_PASSWORD_LENGTH = config.auth.minimumPasswordLength;

/***
 * creates a new user account
 * @param req needs to contain at least req.body.email, req.body.password
 * @param res
 * @param next
 */
exports.signup = function (req, res, next) {
  //req.checkBody('email', 'NOT_AN_EMAIL').isEmail();
  //req.checkBody('password', 'PASSWORD_TOO_SHORT').isLength(MINIMUM_PASSWORD_LENGTH);

  User
    .signup(req.body.email, req.body.password)
    .then(function (user) {
      res.json(user);
    })
    .catch(next);
};

exports.login = function (req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  var resObj = {
    status: 'success',
    email: req.user.email,
    id: req.user._id,
    groups: req.user.groups
  };

  // create token
  var token = jwt.sign(req.user, 'shhhhh');
  resObj[config.auth.jwt.token_name] = token;
  res.set(config.auth.jwt.token_name, token);
  res.send(resObj);
};