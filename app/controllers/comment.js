var config = require('../../config/config').getConfig(),
  R = require('ramda'),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  ObjectId = mongoose.Types.ObjectId;

exports.getAll = function (req, res, next) {
  var query = {};
  if (req.params.articleId) {
    query.articleId = req.params.articleId;
  }
  Comment.find(query)
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};

exports.getOne = function (req, res, next) {
  var query = {"_id": new ObjectId(req.params.commentId)};
  if (req.params.articleId) {
    query.articleId = req.params.articleId;
  }

  Comment.findOne(query)
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};

exports.createReply = function (req, res, next) {

};

exports.create = function (req, res, next) {
  var newComment = new Comment(req.body);
  if (req.params.articleId) {
    newComment.articleId = req.params.articleId;
  }
  newComment.save()
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};

exports.change = function (req, res, next) {
  var query = {"_id": req.params.commentId ? new ObjectId(req.params.commentId) : req.body['_id']};
  if (req.params.articleId) {
    query.articleId = req.params.articleId;
  }

  req.body.articleId = query.articleId;

  Comment.findOneAndUpdate(query, req.body, {upsert: true})
    .then(function (result) {
      res.json(result);
    })
    .catch(next);
};