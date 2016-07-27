var mongo = require('mongodb'),
    assert = require("assert");

var loadSettings = function(db, options, callback) {
  db.collection('settings')
    .find({})
    .sort({dt:-1})
    .limit(1)
    .toArray(function(err, docs) {
      assert.equal(null, err);
      callback(docs[0]);
    })
}

var updateSettings = function(db, data, callback) {
  var mongoId = new mongo.ObjectID(data._id);
  
  db.collection('settings')
    .update(
      {_id:mongoId}, 
      {$set: {maxWords:data.maxWords, lanDir:data.lanDir, dt: new Date()}},
      {upsert:true},
      function(err, r){
        assert.equal(null, err);
        callback(r);
      }
    )
  
}

module.exports = {
  load: function(req, res) {
    var options = {};
    loadSettings(mongo.DB, options, function(doc){
      res.status(200).send({"settings": doc});
    });
  },
  update: function(req, res){
    var options = {};
    updateSettings(mongo.DB, req.body, function(r){
      res.status(200).send(r);
    });
  }
}
