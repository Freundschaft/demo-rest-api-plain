var User = require('../../app/models/user');
var config = require('../config').getConfig();
var R = require('ramda');

var isAuthenticated = function (req, res, next) {
  this.passport.authenticate('jwt', function (err, user, info) {
    if (user) {
      req.user = user;
    }
    if ((req.isAuthenticated() && !req.user.deleted) || (user && !user.deleted)) {
      next();
    } else {
      if (req.accepts('json')) {
        res.status(401).json({
          error: 'Not Authenticated'
        });
        return;
      }

      if (req.accepts('html')) {
        res.redirect("/login");
        return;
      }
      res.type('txt').status(401).send('Server Error');
    }
  })(req, res, next);
};

var isAuthenticatedOrHasValidApiKey = function (req, res, next) {
  if (req.isAuthenticated() || req.query.key === config.apikey) {
    next();
  } else {
    if (req.accepts('json')) {
      res.status(401).json({
        error: 'Not Authenticated'
      });
      return;
    }

    if (req.accepts('html')) {
      res.redirect('/login');
      return;
    }
    res.type('txt').status(401).send('Server Error');
  }
};

var isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.groups.indexOf('Administrators') > -1) {
    next();
  } else {
    next('route');
  }
};

var userExistsAndIsUnverified = function (req, res, next) {
  if (req.user && !req.user.verified) {
    next();
  } else if (req.user && req.user.verified) {
    var err = new Error('USER_ALREADY_VERIFIED');
    err.status = 409;
    next(err);
  }
  else {
    var err = new Error('USER_DOES_NOT_EXIST');
    err.status = 404;
    next(err);
  }
};

module.exports = function (passport) {
  this.passport = passport;
  return {
    isAuthenticated: isAuthenticated,
    isAuthenticatedOrHasValidApiKey: isAuthenticatedOrHasValidApiKey,
    isAdmin: isAdmin,
    userExistsAndIsUnverified: userExistsAndIsUnverified
  };
};