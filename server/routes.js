var path = require("path"),
    words = require("./controllers/words"),
    settings = require("./controllers/settings"),
    answers = require("./controllers/answers"),
    lists = require("./controllers/lists");

module.exports.initialize = function(app, router) {
  var home = path.resolve(__dirname + '/../public/index.html');

  router.get('/', function(request, response){
    response.sendFile(home);
  });
  
  router.get('/api/words', words.load);
  router.get('/api/settings', settings.load);
  router.get('/api/wordlists', lists.load);

  router.put('/api/words', words.update);
  router.put('/api/settings', settings.update);
  router.put('/api/answer', answers.update);
  router.put('/api/lists/edit', lists.update);
  
  router.post('/api/answers', answers.load);
  router.post('/api/words', words.save);
  router.post('/api/lists/add', lists.save);

  app.use(router);

};
