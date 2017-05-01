var cors = require('cors'),
  config = require('../config').getConfig();

var whitelist = config.corsWhiteList;
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};

module.exports = cors(corsOptions);