var mongo = require('mongodb'),
    moment = require('moment'),
    response = require('../response');

var upsertProgress = function(db, options, data, callback) {
  const totalObj = {
    'wordsTestedToday': data.total,
    'totalCorrect': data.answers.correct,
    'totalInCorrect': data.answers.incorrect,
    'totalAnswers': data.answers.incorrect + data.answers.correct,
    'totalLastCorrect': data.answers.lastCorrect,
    'totalLastInCorrect': data.answers.lastIncorrect,
    'totalDifferentWords': data.answers.lastCorrect + data.answers.lastIncorrect,
  };
  const day = moment().format('YYYY-MM-DD');

  db.collection('progress')
    .update(
      {dt: day, userId:options.userId}, 
      {
        $setOnInsert:{dt: day, userId:options.userId},
        $inc:totalObj
      },
      {upsert: true},
      function(err, result){
        callback(err, result);
      }
    )
}

var getAnswersData = function(db, options, callback) {
  var pipeline = [
    {$match:{userId:options.userId}},
    {$group:{"_id": "$userId", "correct":{"$sum":"$total.correct"}, "incorrect":{"$sum":"$total.incorrect"}}},
    {$project:{"userId": "$_id", correct:1, incorrect:1, _id:0}}
  ];

  var pipeline = [
    {$match:{userId:options.userId}},
    {$project: {lastAnswerCorrect : {$cond : [ "$correct", 1, 0 ]}, lastAnswerFalse : {$cond : [ "$correct", 0, 1 ]}, total:1,userId:1}},
    {$group:{"_id": "$userId", "correct":{"$sum":"$total.correct"}, "incorrect":{"$sum":"$total.incorrect"},
    "lastCorrect":{"$sum":"$lastAnswerCorrect"},
    "lastIncorrect":{"$sum":"$lastAnswerFalse"}}},
    {$project:{"userId": "$_id", correct:1, incorrect:1, lastCorrect:1, lastIncorrect:1, _id:0}}
  ];


  db.collection('answers').aggregate(pipeline, function(err, docs) {
    callback(err, docs[0]);
  })
}

module.exports = {
  update: function(req, res){
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    var data = req.body;
    //First get data from answers collection
    getAnswersData(mongo.DB, options, function(err, result){
      response.handleError(err, res, 500, 'Error fetching answers data for progress', function(){
        data.answers = result;
        //Save progress data
        upsertProgress(mongo.DB, options, data, function(err, result){
          response.handleError(err, res, 500, 'Error upserting progress', function(){
            response.handleSuccess(res, result, 200, 'Upserted progress');
          });
        });
      })
    })
  }
}