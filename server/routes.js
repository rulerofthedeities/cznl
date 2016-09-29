var path = require("path"),
    users = require("./controllers/users"),
    words = require("./controllers/words"),
    settings = require("./controllers/settings"),
    answers = require("./controllers/answers"),
    userlists = require("./controllers/userlists"),
    autolists = require("./controllers/autolists");

module.exports.initialize = function(app, router) {
  var home = path.resolve(__dirname + '/../public/index.html');

  router.get('/', function(request, response){
    response.sendFile(home);
  });

  router.get('/user/check', users.check);
  router.post('/user/signin', users.signin);
  router.post('/user/signup', users.signup);
  
  router.get('/words', words.load);
  router.get('/words/check', words.check);
  router.get('/settings', settings.load);
  router.get('/lists/user', userlists.load);
  router.get('/lists/auto', autolists.load);
  router.get('/cats', words.cats);

  router.put('/words', words.update);
  router.put('/settings', settings.update);
  router.put('/answer', answers.update);
  router.put('/lists/edit', userlists.updateName);
  router.put('/lists/words', userlists.updateList);
  
  router.post('/words', words.save);
  router.post('/lists/add', userlists.save);

  app.use('/api/', router);

};
