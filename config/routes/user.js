var config = require('../config.js').getConfig();
var userController = require('../../app/controllers/user');

exports.init = function (app, auth, corsMiddleWare, passport) {
  app.options('/api/v1/users/*', corsMiddleWare);
  app.post('/api/v1/users/login', corsMiddleWare, passport.authenticate('local'), userController.login);
  app.post('/api/v1/users', corsMiddleWare, auth.userDoesNotExist, userController.signup);
};