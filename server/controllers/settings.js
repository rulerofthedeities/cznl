var mongo = require('mongodb'),
    response = require('../response');

var loadSettings = function(db, options, callback) {
  var proj = {};

  switch (options.tpe) {
    case "all": 
      proj = {all:1,_id:0};
      break;
    case "filter":
      proj = {filter:1,_id:0};
      break;
    default:
      proj = {_id:1};
  }

  db.collection('settings')
    .find({userId:options.userId}, proj)
    .sort({dt:-1})
    .limit(1)
    .toArray(function(err, docs) {
      callback(err, docs[0]);
    })
}

var updateSettings = function(db, data, options, callback) {
  var set = {};
  
  switch (options.tpe) {
    case "all": 
      set = {all:{
        maxWords:data.maxWords, 
        lanDir:data.lanDir,
        showPronoun:data.showPronoun,
        showColors:data.showColors}, 
        dt: new Date()};
      break;
    case "filter":
      set = {filter:data, dt: new Date()};
      break;
    default:
      set = {dt:new Date()};
  }

  db.collection('settings')
    .update(
      {userId: options.userId}, 
      {$set: set},
      {upsert:true},
      function(err, result){
        callback(err, result);
      }
    )
}

module.exports = {
  load: function(req, res) {
    var options = {
      tpe:req.query.tpe, 
      userId:mongo.ObjectID(req.decoded.user._id)
    };
    loadSettings(mongo.DB, options, function(err, doc) {
      response.handleError(err, res, 500, 'Error loading settings', function(){
        response.handleSuccess(res, doc, 200, 'Loaded settings');
      });
    });
  },
  update: function(req, res){
    var options = {
      tpe:req.query.tpe, 
      userId:mongo.ObjectID(req.decoded.user._id)
    };
    updateSettings(mongo.DB, req.body, options, function(err, result) {
      response.handleError(err, res, 500, 'Error updating settings', function(){
        response.handleSuccess(res, result, 200, 'Updated settings');
      });
    });
  }
}
