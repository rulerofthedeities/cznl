var mongo = require('mongodb'),
    jwt = require('jsonwebtoken'),
    scrypt = require('scrypt'),
    response = require('../response'),
    settings = require('./settings');

var addUser = function(db, req, res, callback) {
  var key = req.body.password;
  scrypt.kdf(key, {N: 1, r:1, p:1}, function(err, hash) {
    db.collection('users').insert({
      userName: req.body.userName,
      password: hash.toString('base64'),
      email: req.body.email,
      access: {level:1, roles: []}
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
      callback({error:'Gebruikersnaam niet gevonden'}, doc, 500, 'User could not be found')
    } else {
      scrypt.verifyKdf(new Buffer(doc.password, 'base64'), req.body.password, function(err, result) {
        if (result !== true) {
          callback({error:'Fout paswoord'}, doc, 401, 'Aanmelding mislukt');
        } else {
          doc.password = null;
          var token = jwt.sign({user: doc}, process.env.JWT_TOKEN_SECRET, {expiresIn: req.expiresIn});
          callback(null, {message: 'Success', token: token});
        }
      });
    }
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
        settings.create(doc.insertedIds[0]);
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
  getAccess: function(req, res) {
    var userId = mongo.ObjectID(req.decoded.user._id);
    mongo.DB.collection('users').findOne({_id:userId}, function (err, user) {
      response.handleError(err, res, 500, 'Error fetching user access', function() {
        response.handleSuccess(res, user.access, 200, 'Fetched user access');
      });
    });
  },
  refreshToken: function(req, res) {
    var payload = req.decoded;
    delete payload.iat;
    delete payload.exp;
    var token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {expiresIn: req.expiresIn});
    response.handleSuccess(res, token, 200, 'Refreshed token');
  }
}
