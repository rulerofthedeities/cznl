var mongo = require('mongodb'),
    answers = require("./answers"),
    async = require('async');

var loadAutoLists = function(db, options, callback) {
  var lists = [];
  var listTpes = [{
    collection:'answers', 
    id:1,
    name:'Foute antwoorden', 
    filter: {userId:options.userId, correct: false}
  },{
    collection:'answers', 
    id:2,
    name:'Juiste antwoorden', 
    filter: {userId:options.userId, correct: true}
  },{
    collection:'answers',
    id:3,
    name:'Reeds geteste woorden',
    filter: {userId:options.userId}
  }];

  var loadAutoList = function(tpe, callback) {
    db.collection(tpe.collection)
      .count(tpe.filter, function(err, count) {
        lists.push({name:tpe.name, id: tpe.id, count:count});
        callback();
      });
  }

  var loadAutoListNotLearned = function(callback) {
    db.collection('wordpairs')
      .count({}, function(err, allCount) {
        db.collection('answers')
          .count({userId:options.userId}, function(err, doneCount) {
            lists.push({
              name:'Nog niet geteste woorden', 
              id:5, 
              count:allCount - doneCount
            });
            callback();
          })
      });
  }

  var loadAutoListLowPercentage = function(callback) {
    answers.getPercentageWordCount({userId:options.userId}, function(count){
      lists.push({
              name:'Woorden met lage score (<60%)', 
              id:4, 
              count:count
            });
            callback();
    })
  }

  async.eachSeries(listTpes, loadAutoList, function (err) {
    loadAutoListLowPercentage(function(err){
      loadAutoListNotLearned(function(err){
        callback(lists, err);
      })
    })
  });
}

module.exports = {
  load: function(req, res) {
    var listTpe = req.params.listTpe ? req.params.listTpe : 'user';
    var options = {
      userId:'demoUser'
    };
    loadAutoLists(mongo.DB, options, function(listData, err){
      if (err) {
        return res.status(500).json({
          title: 'Error loading auto list',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        lists: listData
      });
    })
  }
}
