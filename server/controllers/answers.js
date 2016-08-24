var mongo = require('mongodb'),
    response = require('../response');

var upsertAnswer = function(db, options, data, callback) {
  var mongoAnswerId = new mongo.ObjectID(data.answerId);
  var mongoWordId = new mongo.ObjectID(data.wordId);
  var counterObj = data.correct ? {'total.correct':1} : {'total.incorrect':1};
  db.collection('answers')
    .update(
      {_id: mongoAnswerId}, 
        {$set: {
          userId: data.userId, 
          wordId: mongoWordId, 
          correct: data.correct, 
          dt: new Date()
        },
        $inc:counterObj
      },
      {upsert: true},
      function(err, result){
        callback(err, result);
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
      callback(err, docs);
    })
}

var getWordIds = function(db, filter, callback) {
  db.collection('answers')
    .find(filter, {
      _id:0, 
      wordId:1
    })
    .toArray(function(err, docs) {
      callback(err, docs);
    })
}

var getWordIdsAbovePercentage = function(db, filter, callback) {
  db.collection('answers').aggregate([
    {$match:filter},
    {$project:{
      wordId:1,
      cor:{$cond:{
        if:{$gt:['$total.correct',0]}, 
        then:'$total.correct', 
        else:0}},
      incor:{$cond:{
        if:{$gt:['$total.incorrect',0]}, 
        then:'$total.incorrect', 
        else:0}}
    }},
    {$project:{
      _id:0,
      wordId:1,
      perc: {
        $cond:{
          if:{$gt:['$incor',0]}, 
          then:{$divide: ['$cor', {$add:['$incor','$cor']}]}, 
          else: 1
        }
      },
    }},
    {$match:{perc:{$lt:0.6}}},
    {$sort:{perc:1}}
  ], function(err, docs) {
    callback(err, docs);
  })
}

var hasAnswerById = function(db, id, userId, callback) {
  db.collection('answers')
    .count({wordId:id,userId:userId}, function(err, count) {
      callback(err, count);
  })
}

var makeIdArray = function(ids) {
  //create array of mongoIDs
  var idsArr = [];
  ids.forEach(function(id) {
    idsArr.push(id.wordId);
  })
  return idsArr;
}

module.exports = {
  update: function(req, res){
    var options = {userId:'demoUser'};
    upsertAnswer(mongo.DB, options, req.body, function(err, result){
      response.handleError(err, res, 500, 'Error upserting answer', function(){
        response.handleSuccess(res, result, 200, 'Upserted answer');
      });
    });

  },
  getAnswersInDoc: function(userId, words, callback){
    getAnswers(mongo.DB, userId, words, function(err, docs){
      callback(err, docs);
    });
  },
  getIncorrectWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      correct:false
    }
    getWordIds(mongo.DB, filter, function(err, ids){
      callback(err, makeIdArray(ids));
    })
  },
  getCorrectWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      correct:true
    }
    getWordIds(mongo.DB, filter, function(err, ids){
      callback(err, makeIdArray(ids));
    })
  },
  getAnsweredWordIds: function(options, callback) {
    var filter = {
      userId:options.userId
    }
    getWordIds(mongo.DB, filter, function(err, ids){
      callback(err, makeIdArray(ids));
    })
  },
  getPercentageWordIds: function(options, callback) {
    var filter = {
      userId:options.userId,
      total:{$exists:true}
    }
    getWordIdsAbovePercentage(mongo.DB, filter, function(err, ids){
      callback(err, makeIdArray(ids));
    })
  },
  getPercentageWordCount: function(options, callback) {
    var filter = {
      userId:options.userId,
      total:{$exists:true}
    }
    getWordIdsAbovePercentage(mongo.DB, filter, function(err, ids){
      callback(err, ids.length);
    })
  },
  hasAnswer: function(id, userId, callback) {
    hasAnswerById(mongo.DB, id, userId, function(err, count){
      callback(err, count > 0);
    });
  }
}
