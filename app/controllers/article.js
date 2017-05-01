var config = require('../../config/config').getConfig(),
  R = require('ramda'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

exports.getAll = function (req, res, next) {
  Article.find({})
    .then(function (result) {
      console.log(result);
      res.json(result);
    })
    .catch(next);
};

exports.getOne = function (req, res, next) {
  Article.findById(req.params.articleId)
    .then(function (result) {
      console.log(result);
      res.json(result);
    })
    .catch(res.json);
};

exports.create = function (req, res, next) {
  var newArticle = new Article(req.body);
  newArticle.save()
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};

exports.changeById = function (req, res, next) {
  Article.findByIdAndUpdate(req.params.articleId, req.body, {upsert: true})
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};

exports.change = function (req, res, next) {
  Article.findOneAndUpdate(req.body, req.body, {upsert: true})
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};