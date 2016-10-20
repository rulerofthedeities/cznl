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
  var setDt = new Date(),
      setAll = {
        maxWords:data.maxWords, 
        lanDir:data.lanDir,
        showPronoun:data.showPronoun,
        showColors:data.showColors},
      setFilter = data.filter;
  
  switch (options.tpe) {
    case "all": 
      set = {all:setAll, dt:setDt};
      break;
    case "filter":
      set = {filter:setFilter, dt:setDt};
      break;
    case "new":
      set = {all:setAll, filter:setFilter, dt:setDt};
      break;
    default:
      set = {dt:setDt};
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
  },
  create: function(userId) {
    var options = {
      tpe:'new', 
      userId:mongo.ObjectID(userId)
    };
    var data = {
      maxWords: 25, 
      lanDir:'nlcz',
      showPronoun:false,
      showColors:true,
      filter: {
        level: -1, 
        "tpe" : "all", 
        "cats" : "all", 
        "test" : "review"
      }
    }
    updateSettings(mongo.DB, data, options, function(err, result) {});
  }
}
