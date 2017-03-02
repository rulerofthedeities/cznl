var mongo = require('mongodb'),
    moment = require('moment'),
    response = require('../response');

var upsertProgress = function(db, options, data, callback) {
  const totalObj = {
    'totalCorrect': data.answers.correct,
    'totalInCorrect': data.answers.incorrect,
    'totalLastCorrect': data.answers.lastCorrect,
    'totalLastInCorrect': data.answers.lastIncorrect
  };
  const day = moment().format('YYYY-MM-DD');

  db.collection('progress')
    .update(
      {dt: day, userId:options.userId}, 
      {
        $setOnInsert:{dt: day, userId:options.userId},
        $set:totalObj,
        $inc:{
          wordsTestedToday: data.total,
          wordsCorrectToday: data.correct,
          wordsInCorrectToday: data.incorrect,
          wordsReviewedToday: data.review,
          wordsNewToday: data.new
        }
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

var loadProgress = function(db, options, callback) {
  const lastDay = moment().subtract(options.monthsBack, 'months').endOf('month').add(7, 'd');
  const firstDay = moment(lastDay).subtract(42, 'd');
  db.collection('progress')
    .find({userId:options.userId, dt: {$gte:firstDay.format('YYYY-MM-DD'), $lte:lastDay.format('YYYY-MM-DD')}}, {_id:0, userId:0})
    .limit(42)
    .sort({dt:1})
    .toArray(function(err, docs) {
      callback(err, docs);
    })
}

module.exports = {
  update: function(req, res) {
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    var data = req.body;
    //First get data from answers collection
    getAnswersData(mongo.DB, options, function(err, result) {
      response.handleError(err, res, 500, 'Error fetching answers data for progress', function(){
        data.answers = result;
        //Save progress data
        upsertProgress(mongo.DB, options, data, function(err, result) {
          response.handleError(err, res, 500, 'Error upserting progress', function(){
            response.handleSuccess(res, result, 200, 'Upserted progress');
          });
        });
      })
    })
  },
  getStats: function(req, res) {
    var options = {
      userId: mongo.ObjectID(req.decoded.user._id),
      monthsBack: parseInt(req.params.months)
    };

    loadProgress(mongo.DB, options, function(err, docs) {
      response.handleError(err, res, 500, 'Error fetching progress stats', function(){
        response.handleSuccess(res, docs, 200, 'Fetched progress stats');
      });
    });
  }
}