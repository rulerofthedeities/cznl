var mongo = require('mongodb');

var updateSettings = function(db, data, callback) {
  var mongoId = new mongo.ObjectID(data.wordId);
  
  db.collection('answers')
    .update(
      {_id:mongoId}, 
      {$set: {userId:data.userId, wordId:data.wordId, correct:data.correct, dt: new Date()}},
      {upsert:true},
      function(err, r){
        callback(r);
      }
    )
}

var getAnswers = function(db, userId, data, callback) {

  db.collection('answers')
    .find({
      userId:userId,
      wordId:{$in:data}},
      {_id:0, wordId:1, correct:1, listIds:1})
    .toArray(function(err, docs) {
      callback(docs);
    })
}

module.exports = {
  load: function(req, res){
    var words = req.body;
    var userId = 'demoUser';
    getAnswers(mongo.DB, userId, words, function(docs){
      res.status(200).send({"answers": docs});
    });
  },
  update: function(req, res){
    var options = {};
    updateSettings(mongo.DB, req.body, function(r){
      res.status(200).send(r);
    });
  },
  getAnswersInDoc: function(userId, words, callback){
    getAnswers(mongo.DB, userId, words, function(docs){
      callback(docs);
    });
  }
}
