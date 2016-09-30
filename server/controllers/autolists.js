var mongo = require('mongodb'),
    answers = require("./answers"),
    async = require('async'),
    response = require('../response');

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
        callback(err);
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
            callback(err);
          })
      });
  }

  var loadAutoListLowPercentage = function(callback) {
    answers.getPercentageWordCount({userId:options.userId}, function(err, count){
      lists.push({
        name:'Woorden met lage score (<60%)', 
        id:4, 
        count:count
      });
      callback(err);
    })
  }

  async.eachSeries(listTpes, loadAutoList, function(err) {
    loadAutoListLowPercentage(function(err){
      loadAutoListNotLearned(function(err){
        callback(err, lists);
      })
    })
  });
}

module.exports = {
  load: function(req, res) {
    var listTpe = req.params.listTpe ? req.params.listTpe : 'user';
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    loadAutoLists(mongo.DB, options, function(err, listData) {
      response.handleError(err, res, 500, 'Error loading auto lists', function(){
        response.handleSuccess(res, listData, 200, 'Auto lists loaded', 'lists');
      });
    })
  }
}
