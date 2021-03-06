var path = require("path"),
    jwt = require('jsonwebtoken'),
    users = require("./controllers/users"),
    words = require("./controllers/words"),
    settings = require("./controllers/settings"),
    answers = require("./controllers/answers"),
    progress = require("./controllers/progress"),
    userlists = require("./controllers/userlists"),
    autolists = require("./controllers/autolists"),
    response = require('./response');

module.exports.initialize = function(app, router) {

  router.use(['/user/refresh', '/user/signin'], (req, res, next) => {
    req.expiresIn = app.get('token_expiration') || 86400;
    next();
  });

  router.get('/user/check', users.check);
  router.post('/user/signin', users.signin);
  router.post('/user/signup', users.signup);
  
  router.use('/', function(req, res, next) {
    jwt.verify(req.token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
      response.handleError(err, res, 401, 'Authentication failed', function(){
        req.decoded = decoded;
        next();
      });
    });
  });

  router.patch('/user/refresh', users.refreshToken);
  router.get('/user/access', users.getAccess);

  router.get('/words', words.load);
  router.get('/words/check', words.check);
  router.get('/settings', settings.load);
  router.get('/lists/user', userlists.load);
  router.get('/lists/auto', autolists.load);
  router.get('/cats', words.cats);
  router.get('/progress/:months', progress.getStats);

  router.put('/words', words.update);
  router.put('/settings', settings.update);
  router.put('/answer', answers.update);
  router.put('/lists/edit', userlists.updateName);
  router.put('/lists/words', userlists.updateList);
  router.put('/progress', progress.update);
  
  router.post('/words', words.save);
  router.post('/lists/add', userlists.save);

  app.use('/api/', router);

  app.use(function (req, res) {
    var home = path.resolve(__dirname + '/../dist/index.html');
    res.sendFile(home);
  });
};
