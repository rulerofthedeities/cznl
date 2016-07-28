var mongo = require('mongodb'),
    assert = require("assert");

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
      assert.equal(null, err);
      callback(docs[0]);
    })
}

var updateSettings = function(db, data, options, callback) {
  var set = {};

  switch (options.tpe) {
    case "all": 
      set = {all:{maxWords:data.maxWords, lanDir:data.lanDir}, dt: new Date()};
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
      function(err, r){
        assert.equal(null, err);
        callback(r);
      }
    )
}

module.exports = {
  load: function(req, res) {
    var options = {
      tpe:req.query.tpe, 
      userId:'demoUser'
    };
    loadSettings(mongo.DB, options, function(doc){
      res.status(200).send({"settings": doc});
    });
  },
  update: function(req, res){
    var options = {
      tpe:req.query.tpe, 
      userId:'demoUser'
    };
    updateSettings(mongo.DB, req.body, options, function(r){
      res.status(200).send(r);
    });
  }
}
