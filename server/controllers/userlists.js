var mongo = require('mongodb'),
    response = require('../response');

var loadUserLists = function(db, options, callback) {
  db.collection('wordlists')
    .find({userId:options.userId})
    .toArray(function(err, docs) {
      callback(err, docs);
    });
}

var saveNewList = function(db, data, options, callback) {
  if (data.name) {
    db.collection('wordlists')
      .insert({userId:options.userId, name:data.name},
        function(err, result) {
          callback(err, result);
        });
  }
}

var updateListName = function(db, data, options, callback) {
  var listId = new mongo.ObjectID(data._id);
  if (data.name) {
    db.collection('wordlists')
      .update(
        {_id: listId, userId:options.userId},
        {$set:{name:data.name}}, 
        function(err, result) {
          callback(err, result);
        });
  }
}

var updateUserList = function(db, data, options, callback) {
  var listId = new mongo.ObjectID(data.userListId);
  var wordId = new mongo.ObjectID(data.wordId);
  //if word is in list, add it to the list, otherwise remove it from the list
  var update = data.isInList ? {$addToSet:{'wordIds':wordId}} : {$pull:{'wordIds':wordId}};
  db.collection('wordlists')
  .update(
    {_id:listId},
    update, 
    function(err, result) {
      callback(err, result);
    });
}

var getWordIds = function(db, filter, callback) {
  db.collection('wordlists')
    .find(filter, {
      _id:0, 
      wordIds:1
    })
    .toArray(function(err, docs) {
      callback(err, docs);
    })
}

module.exports = {
  load: function(req, res) {
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    loadUserLists(mongo.DB, options, function(err, lists){
      lists.forEach(function(list) {list.count = list.wordIds ? list.wordIds.length : 0;});
      response.handleError(err, res, 500, 'Error retrieving list', function(){
        response.handleSuccess(res, lists, 200, 'Retrieved list', 'lists');
      });
    });
  },
  save: function(req, res) {
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    saveNewList(mongo.DB, req.body, options, function(err, result){
      response.handleError(err, res, 500, 'Error saving list', function(){
        response.handleSuccess(res, result, 200, 'Saved list');
      });
    })
  },
  updateList: function(req, res) {
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    updateUserList(mongo.DB, req.body, options, function(err, result){
      response.handleError(err, res, 500, 'Error updating list', function(){
        response.handleSuccess(res, result, 200, 'Updated list');
      })
    });
  },
  updateName: function(req, res) {
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    updateListName(mongo.DB, req.body, options, function(err, result){
      response.handleError(err, res, 500, 'Error updating list name', function(){
        response.handleSuccess(res, result, 200, 'Updated list name');
      });
    })
  },
  getWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      _id:new mongo.ObjectID(options.listId)
    }
    getWordIds(mongo.DB, filter, function(err, ids){
      callback(err, ids[0].wordIds);
    })
  },
}
