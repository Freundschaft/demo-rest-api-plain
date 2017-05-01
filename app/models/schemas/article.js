var mongoose = require('mongoose');

var ArticleSchema = mongoose.Schema({
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
  }
});

ArticleSchema.index({
  'slug': 1
});

module.exports = ArticleSchema;