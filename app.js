var express = require('express'),
  bodyParser = require('body-parser'),
  conf = require('./config/config'),
  config = conf.getConfig(),
  isInDev = conf.isInDev(),
  glob = require('glob'),
  env = conf.getEnv(),
  fs = require('fs'),
  path = require('path'),
  isInTest = conf.isInTest(),
  R = require('ramda'),
  mongooseHelper = require('./config/mongoose'),
  passport = require('passport');

//load boot scripts
glob.sync('./app/models/**/*.js').forEach(function (file) {
  require(path.resolve(file));
});

require('./config/passport')(passport, config);

var app = express(),
  port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
  ipAddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';

app
  .set('port', port)
  .set('ipAddress', ipAddress)
  .enable('trust proxy')
  .use(bodyParser.urlencoded(config.bodyParser.urlencoded))
  .use(bodyParser.json(config.bodyParser.json))
  .use(passport.initialize())
  .use(passport.session());

require('./config/routes/index').init(app, passport);

//load boot scripts
glob.sync('./config/boot/**/*.js').forEach(function (file) {
  require(path.resolve(file)).init(app);
});

init();

function init() {
  mongooseHelper
    .initDb(config.mongodb.url, config.mongodb.loggingEnabled && !process.env.DISABLE_LOGGING)
    .then(function () {
      startServer();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function startServer() {
  require('http')
    .createServer(app)
    .listen(app.get('port'), app.get('ipAddress'), function () {
      console.log('server listening on port:', app.get('port'));
    });

  process.on('SIGINT', function () {
    mongooseHelper
      .closeDb()
      .then(process.exit.bind(process, 0))
      .catch(function (err) {
        console.log(err);
        throw err;
      });
  });
}

app.config = config;
// export app so we can test it
exports = module.exports = app;