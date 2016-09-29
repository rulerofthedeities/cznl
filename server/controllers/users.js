var mongo = require('mongodb'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    response = require('../response'),
    saltRounds = 10;

var addUser = function(db, req, res, callback) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    db.collection('users').insert({
      userName: req.body.userName,
      password: hash,
      email: req.body.email
    }, function (err, result) {
      callback(err, result);
    });
  });
};

var findUser = function(db, req, res, callback) {
  db.collection('users').findOne({
    email: req.body.email
  }, function (err, doc) {
    if (err) {
      callback(err, doc, 500, 'Error finding user')
    }
    if (!doc) {
      callback({error:'no user'}, doc, 500, 'User could not be found')
    }
    bcrypt.compare(req.body.password, doc.password, function(err, result) {
      if (result !== true) {
        callback({error:'Invalid password'}, doc, 401, 'Could not sign you in');
      } else {
        var token = jwt.sign({user: doc}, 'secret', {expiresIn: 86400});
        callback(null, {message: 'Success', token: token, userId: doc._id, userName:doc.userName});
      }
    });
  })
};

var isUniqueEmail = function(db, req, res, options, callback) {
  db.collection('users')
    .findOne({email:options.mail}, function(err, doc) {
      callback(err, doc !== null);
  });
}

var isUniqueUser = function(db, req, res, options, callback) {
  db.collection('users')
    .findOne({userName:options.user}, function(err, doc) {
      callback(err, doc !== null);
  });
}

module.exports = {
  signup: function(req, res) {
    addUser(mongo.DB, req, res, function(err, doc) {
      response.handleError(err, res, 500, 'Error creating new user', function(){
        response.handleSuccess(res, doc, 200, 'Created new user');
      });
    });
  },
  signin: function(req, res) {
    findUser(mongo.DB, req, res, function(err, result, errno, errmsg) {
      response.handleError(err, res, errno, errmsg, function(){
        response.handleSuccess(res, result, 200, 'Signed in successfully');
      });
    });
  },
  check: function(req, res) {
    var options = {mail:req.query.mail, user:req.query.user}
    if (options.mail) {
      isUniqueEmail(mongo.DB, req, res, options, function(err, exists){
        response.handleError(err, res, 500, 'Error checking email', function(){
          response.handleSuccess(res, exists, 200, 'Checked email');
        });
      })
    }
    if (options.user) {
      isUniqueUser(mongo.DB, req, res, options, function(err, exists){
        response.handleError(err, res, 500, 'Error checking user', function(){
          response.handleSuccess(res, exists, 200, 'Checked user');
        });
      })
    }
  },
  getUserName: function(req, res) {
    var userId = req.decoded.user._id;
    mongo.DB.collection('users').findById(userId, function (err, user) {
      response.handleError(err, res, 500, 'Error fetching user name', function(){
        response.handleSuccess(res, user.userName, 200, 'Fetched user name');
      });
    });
  }
}
