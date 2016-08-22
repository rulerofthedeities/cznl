var mongo = require('mongodb');

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
      callback(docs);
    })
}

var handleError = function(err, res, statusno, title, callback) {
  if (err) {
    return res.status(statusno).json({
      title: title,
      error: err
    });
  } else {
    callback();
  }
}

var handleSuccess = function(res, result, statusno, message, objname) {
  objname = objname || 'obj';
  var returnObj = {message:message};
  returnObj[objname] = result;
  
  res.status(statusno).send(returnObj);
}

module.exports = {
  load: function(req, res) {
    console.log('loading lists');
    var options = {userId: 'demoUser'};
    loadUserLists(mongo.DB, options, function(err, lists){
      lists.forEach(function(list) {list.count = list.wordIds ? list.wordIds.length : 0;});
      handleError(err, res, 500, 'Error retrieving list', function(){
        handleSuccess(res, lists, 200, 'Retrieved list', 'lists');
      });
    });
  },
  save: function(req, res) {
    var options = {userId: 'demoUser'};
    saveNewList(mongo.DB, req.body, options, function(err, result){
      handleError(err, res, 500, 'Error saving list', function(){
        handleSuccess(res, result, 200, 'Saved list');
      });
    })
  },
  updateList: function(req, res) {
    var options = {userId:'demoUser'};
    updateUserList(mongo.DB, req.body, options, function(err, result){
      handleError(err, res, 500, 'Error updating list', function(){
        handleSuccess(res, result, 200, 'Updated list');
      })
    });
  },
  updateName: function(req, res) {
    var options = {userId:'demoUser'};
    updateListName(mongo.DB, req.body, options, function(err, result){
      handleError(err, res, 500, 'Error updating list name', function(){
        handleSuccess(res, result, 200, 'Updated list name');
      });
    })
  },
  getWordIds: function(options, callback) {
    var filter = {
      userId:options.userId, 
      _id:new mongo.ObjectID(options.listId)
    }
    getWordIds(mongo.DB, filter, function(ids){
      callback(ids[0].wordIds);
    })
  },
}
