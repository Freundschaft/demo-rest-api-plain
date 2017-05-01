var mongoose = require('mongoose'),
  Promise = require('bluebird');

var mongoOption = {
  socketOptions: {
    noDelay: true,
    keepAlive: 1,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 0
  },
  auto_reconnect: true,
  reconnectInterval: 200,
  reconnectTries: 30
};

var mongoOptions = {
  server: mongoOption,
  replset: mongoOption
};

module.exports = {
  initDb: function (dbUrl, enableLog) {
    return new Promise(function (resolve, reject) {
      mongoose.set('debug', !!enableLog);
      connect();

      var conn = mongoose.connection;

      // This is really bad - unfortunatly needed
      module.exports.roadAtlasConnection = conn;
      module.exports.feedbackConnection = conn.useDb('feedback');

      function connect() {
        mongoose.connect(dbUrl, mongoOptions);
      }

      conn.on('connecting', function () {
        console.log('connecting to MongoDB...');
      });

      conn.on('connected', function () {
        console.log('MongoDB connected');
      });

      conn.on('reconnected', function () {
        console.log('MongoDB reconnected');
      });

      conn.on('disconnected', function () {
        console.log('MongoDB disconnected');
        // Delay the reconnect a little - otherwise connect will be executed 123812 times a second (rough estimation)
        // Isn't mongoose not auto reconnecting (see options) by itself?
        setTimeout(connect, 500);
      });

      conn.on('error', function (err) {
        console.log('connection error: ' + err);
        reject(err);
      });

      //@todo handle connection error and try to gracefully reconnect with timeout
      //not sure if this is necessary, as mongoDB seems to be able to gracefully reconnect automatically

      conn.once('open', function () {
        resolve(conn);
      });
    });
  },
  closeDb: function () {
    return new Promise(function (resolve) {
      mongoose.connection.close(function () {
        console.log('mongoose disconnected on app termination');
        resolve();
      });
    });
  }
};
