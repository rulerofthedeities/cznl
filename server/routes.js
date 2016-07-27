var path = require("path"),
    words = require("./controllers/words"),
    settings = require("./controllers/settings");

module.exports.initialize = function(app, router) {
  var home = path.resolve(__dirname + '/../public/index.html');

  router.get('/', function(request, response){
    response.sendFile(home);
  });
  
  router.get('/api/words', words.load);
  router.get('/api/settings', settings.load);
  router.put('/api/settings', settings.update);

  app.use(router);

};
