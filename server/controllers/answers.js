var mongo = require('mongodb'),
    assert = require("assert");

var updateSettings = function(db, data, callback) {
  var mongoId = new mongo.ObjectID(data.wordId);
  
  db.collection('answers')
    .update(
      {_id:mongoId}, 
      {$set: {userId:data.userId, wordId:data.wordId, correct:data.correct, dt: new Date()}},
      {upsert:true},
      function(err, r){
        assert.equal(null, err);
        callback(r);
      }
    )
  
}

module.exports = {
  update: function(req, res){
    var options = {};
    updateSettings(mongo.DB, req.body, function(r){
      res.status(200).send(r);
    });
  }
}
