var R = require('ramda'),
  corsMiddleWare = require('../middlewares/cors'),
  fs = require('fs'),
  path = require('path');

exports.init = function (app, passport) {
  var auth = require('../middlewares/authorization')(passport);
  // Here are all the routes initialized (same directory)

  var routeScripts = R.without(__filename, fs.readdirSync(__dirname));

  R.forEach(function (route) {
    require(path.join(__dirname, route)).init(app, auth, corsMiddleWare, passport);
  }, routeScripts);
};