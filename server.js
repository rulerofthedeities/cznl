'use strict';

var express = require('express'),
    app = express(),
    compression = require('compression'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routes = require('./server/routes'),
    db = require('./server/db');

//config
app.set('port', process.env.PORT || 4000);
app.set('env', process.env.NODE_ENV || 'development');

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'hbs');

//middleware
app.use(compression());

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
db.connect(function(){
  app.listen(app.get('port'), function() { 
    console.log('Server up: http://localhost:' + app.get('port'));
  });
});
