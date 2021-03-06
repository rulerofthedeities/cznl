'use strict';

var express = require('express'),
    app = express(),
    compression = require('compression'),
    path = require('path'),
    bodyParser = require('body-parser'),
    bearerToken  = require('express-bearer-token'),
    routes = require('./server/routes'),
    indexes = require('./server/indexes'),
    db = require('./server/db');

process.on("uncaughtException", console.error);

//config
app.set('port', process.env.PORT || 4000);
app.set('env', process.env.NODE_ENV || 'development');
app.set('token_expiration', 604800);// Token expires after 7 days

//Check if required config vars are present
if (!process.env.JWT_TOKEN_SECRET) {
  console.log('WARNING: no config var JWT_TOKEN_SECRET set!!');
}

//middleware
app.use(compression());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

//routing
routes.initialize(app, new express.Router());

//Check if in development mode
if (app.get('env') == 'development') {
  console.log('Server running in development mode');
}

//start server
db.connect(function() {
  indexes.create(function() {
    app.listen(app.get('port'), function() { 
      console.log('Server up: http://localhost:' + app.get('port'));
    })
  })
});
