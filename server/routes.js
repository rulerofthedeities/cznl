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
  
  router.get('/words', words.load);
  router.get('/settings', settings.load);
  router.get('/wordlists/:listTpe?', lists.load);
  router.get('/cats', words.cats);

  router.put('/words', words.update);
  router.put('/settings', settings.update);
  router.put('/answer', answers.update);
  router.put('/lists/edit', lists.update);
  
  router.post('/answers', answers.load);
  router.post('/words', words.save);
  router.post('/lists/add', lists.save);

  app.use('/api/', router);

};
