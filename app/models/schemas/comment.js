var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
  title: String,
  content: String,
  slug: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  owner: String,
  createdOn: {
    type: Date,
    default: Date.now
  },
  articleId: String,
  commentId: String
});

CommentSchema.index({
  'slug': 1
});

module.exports = CommentSchema;
