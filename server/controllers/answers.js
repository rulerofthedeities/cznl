var mongo = require('mongodb');

var updateAnswers = function(db, options, data, callback) {
  var mongoId = new mongo.ObjectID(data.wordId);
  var counterObj = data.correct ? {'total.correct':1} : {'total.incorrect':1};

  db.collection('answers')
    .update(
      {_id:mongoId}, 
      {$set: {
        userId:data.userId, 
        wordId:data.wordId, 
        correct:data.correct, 
        dt: new Date()},
      $inc:counterObj},
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
      {_id:1, wordId:1, correct:1, listIds:1})
    .toArray(function(err, docs) {
      callback(docs);
    })
}

var updateListIds = function(db, options, answer, callback) {
  var mongoId = new mongo.ObjectID(answer._id);
  var listId = answer.listIds ? answer.listIds : [];
  db.collection('answers')
    .update(
      {userId: options.userId, _id:mongoId}, 
      {$set: {listIds:answer.listIds}, 
        $setOnInsert:{
          userId:options.userId,
          wordId:answer.wordId, 
          dt: new Date()
      }},
      {upsert:true},
      function(err, r){
        callback(r);
      }
    );
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
    var options = {
      userId:'demoUser'
    };
    if (req.query.tpe === "listids") {
      updateListIds(mongo.DB, options, req.body, function(r){
        res.status(200).send(r);
      });
    } else {
      updateAnswers(mongo.DB, options, req.body, function(r){
        res.status(200).send(r);
      });
    }
  },
  getAnswersInDoc: function(userId, words, callback){
    getAnswers(mongo.DB, userId, words, function(docs){
      callback(docs);
    });
  }
}
