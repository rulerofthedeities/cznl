'use strict';

var express = require('express'),
    app = express(),
    compression = require('compression'),
    path = require('path'),
    bodyParser = require('body-parser'),
    bearerToken  = require('express-bearer-token'),
    routes = require('./server/routes'),
    db = require('./server/db');

//config
app.set('port', process.env.PORT || 4000);
app.set('env', process.env.NODE_ENV || 'development');
app.set('token_expiration', 604800);// Token expires after 7 days

//Check if required config vars are present
if (!process.env.JWT_TOKEN_SECRET) {
  console.log('WARNING: no config var JWT_TOKEN_SECRET set!!');
}

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'hbs');

//middleware
app.use(compression());
app.use(bearerToken());

if (app.get('env') == 'development') {
  console.log('Server running in development mode');
  app.use('/node', express.static(path.join(__dirname, '/node_modules')));
}

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());

app.use('/client', express.static(path.join(__dirname, '/client')));

//routing
routes.initialize(app, new express.Router());

//render index page
app.use(function (req, res, next) {
  return res.render('index');
});

//start server
db.connect(function() {
  app.listen(app.get('port'), function() { 
    console.log('Server up: http://localhost:' + app.get('port'));
  });
});
