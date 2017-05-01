var articleController = require('../../app/controllers/article.js');
var commentController = require('../../app/controllers/comment.js');

exports.init = function (app, auth, corsMiddleWare, passport) {
  app.all('/api/v1/*', corsMiddleWare);

  app.get('/api/v1/articles', corsMiddleWare, auth.isAuthenticated, articleController.getAll);
  app.get('/api/v1/articles/:articleId', corsMiddleWare, auth.isAuthenticated, articleController.getOne);

  app.post('/api/v1/articles', corsMiddleWare, auth.isAdmin, articleController.create);
  app.put('/api/v1/articles', corsMiddleWare, auth.isAdmin, articleController.changeById);
  app.put('/api/v1/articles/:articleId', corsMiddleWare, auth.isAdmin, articleController.change);

  app.get('/api/v1/articles/:articleId/comments', corsMiddleWare, auth.isAuthenticated, commentController.getAll);
  app.get('/api/v1/articles/:articleId/comments/:commentId', corsMiddleWare, auth.isAuthenticated, commentController.getOne);

  app.post('/api/v1/articles/:articleId/comments', corsMiddleWare, auth.isAuthenticated, commentController.create);
  app.put('/api/v1/articles/:articleId/comments/:commentId', corsMiddleWare, auth.isAuthenticated, commentController.change);
  app.put('/api/v1/articles/:articleId/comments', corsMiddleWare, auth.isAuthenticated, articleController.change);
  
  app.post('/api/v1/articles/:articleId/comments/:commentId/reply', corsMiddleWare, auth.isAdmin, commentController.createReply);
};