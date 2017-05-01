var mongoose = require('mongoose');
var Hash = require('../util/hash');
var crypto = require('crypto');
var Promise = require('bluebird');
var randomBytes = Promise.promisify(crypto.randomBytes);

var UserSchema = require('./schemas/user');

UserSchema.statics.signup = function (email, password) {
  var User = this;
  var oneDayInMilliSeconds = 86400000;

  email = email.toLowerCase();

  return randomBytes(20)
    .call('toString', 'hex')
    .then(function (token) {
      return token + ',' + new Buffer(email).toString('base64');
    })
    .then(function (token) {
      return Hash.createHash(password)
        .then(function (result) {
          return [token, result.salt, result.hash];
        });
    })
    .spread(function (token, salt, hash) {
      return User
        .create({
          active: true,
          verified: false,
          email: email,
          salt: salt,
          hash: hash,
          groups: ['Users']
        });
    })
};

UserSchema.statics.patch = function (id, username, email, password, firstName, lastName) {
  var User = this;
  var oneDayInMilliSeconds = 86400000;
  var verifyTokenExpireDate = Date.now() + oneDayInMilliSeconds;

  if (username) {
    username = username.toLowerCase();
  } else if (email) {
    username = email = email.toLowerCase();
  }

  return User.findOne({_id: id}).exec()
    .then(function (user) {
      // update fields in case of a change
      user.firstName = (firstName != null) ? firstName : user.firstName;
      user.lastName = (lastName != null) ? lastName : user.lastName;

      // change mail, send new verification and disable account
      if (email != null && user.email != email) {
        var token = crypto.randomBytes(20).toString('hex');
        user.email = email;
        user.verified = false;
        user.verifyToken = token;
        user.verifyTokenExpires = verifyTokenExpireDate;
      }

      user.username = (username != null) ? username : user.username;

      // change passwort if set -> new hash
      if (password != null) {
        return Hash.getHash(password, user.salt)
          .then(function (hash) {
            user.hash = hash;
            return user;
          })
      } else {
        return user;
      }
    })
    .then(function (user) {
      return user.save();
    });
};

UserSchema.statics.isValidUserPassword = function (email, password, done) {
  email = email.toLowerCase();

  return this
    .findOne({
      email: email
    }).exec()
    .then(function (user) {
      var msg;

      if (!user) {
        msg = 'Incorrect email.';
      } else if (!user.verified && user.verifyToken) {
        msg = 'User is not verified';
      } else if (user.deleted) {
        msg = 'USER_DELETED';
      }

      if (msg) {
        return done(null, false, {
          message: msg
        });
      }
      return Hash.getHash(password, user.salt)
        .then(function (hash) {
          if (hash == user.hash) {
            return done(null, user)
          } else {
            done(null, false, {
              message: 'Incorrect password'
            });
          }
        });
    })
    .catch(done);
};

var User = mongoose.model('User', UserSchema);

User.query = User.query || {};
User.query.validatedUsers = {
  $or: [{
    verified: true,
    facebook: {
      $exists: false
    }
  }, {
    facebook: {
      $exists: true
    }
  }]
};

User.query.admins = {
  groups: {
    $all: ['Administrators']
  }
};

Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
module.exports = User;
