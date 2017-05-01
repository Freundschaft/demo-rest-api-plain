var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User'),
  R = require('ramda');

module.exports = function (passport, config) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, done);
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {
      if (email && password) {
        User.isValidUserPassword(email, password, done);
      } else {
        done();
      }
    }
  ));
};
