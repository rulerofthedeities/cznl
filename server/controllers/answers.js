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

var getWordIds = function(db, filter, callback) {
  db.collection('answers')
    .find(filter, {
      _id:0, 
      wordId:1
    })
    .toArray(function(err, docs) {
      callback(docs);
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
  console.log(docs);
  callback(docs);
})

}


var hasAnswerById = function(db, id, userId, callback) {
  db.collection('answers')
    .count({_id:id,userId:userId}, function(err, count) {
      callback(count);
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

var makeIdArray = function(ids) {
  //create array of mongoIDs
  //could - should? - be done in aggregation
  var idsArr = [],
      mongoId;
  ids.forEach(function(id) {
    mongoId = new mongo.ObjectID(id.wordId);
    idsArr.push(mongoId);
  })
  return idsArr;
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
  },
  getWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      listIds:options.listId
    }
    getWordIds(mongo.DB, filter, function(ids){
      callback(makeIdArray(ids));
    })
  },
  getIncorrectWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      correct:false
    }
    getWordIds(mongo.DB, filter, function(ids){
      callback(makeIdArray(ids));
    })
  },
  getCorrectWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      correct:true
    }
    getWordIds(mongo.DB, filter, function(ids){
      callback(makeIdArray(ids));
    })
  },
  getAnsweredWordIds: function(options, callback) {
    var filter = {
      userId:options.userId
    }
    getWordIds(mongo.DB, filter, function(ids){
      callback(makeIdArray(ids));
    })
  },
  getPercentageWordIds: function(options, callback) {
    var filter = {
      userId:options.userId,
      total:{$exists:true}
    }
    getWordIdsAbovePercentage(mongo.DB, filter, function(ids){
      callback(makeIdArray(ids));
    })
  },
  getPercentageWordCount: function(options, callback) {
    var filter = {
      userId:options.userId,
      total:{$exists:true}
    }
    getWordIdsAbovePercentage(mongo.DB, filter, function(ids){
      callback(ids.length);
    })
  },
  hasAnswer: function(id, userId, callback) {
    hasAnswerById(mongo.DB, id, userId, function(count){
      callback(count > 0);
    });
  }
}
