var User = require('../../app/models/user');
var newUser = {
  email: 'qiong.wu@gfnork.de',
  password: 'password'
};

exports.init = function (app) {
  User
    .findOne({
      email: newUser.email
    })
    .then(function (user) {
      if (!user) {
        return User.signup(newUser.email, newUser.password);
      } else {
        return user;
      }
    })
    .then(function (user) {
      console.log('done');
    })
    .catch(console.log);
};