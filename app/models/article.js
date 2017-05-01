var Bluebird = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Bluebird;
module.exports = mongoose.model('Article', require('./schemas/article.js'));
