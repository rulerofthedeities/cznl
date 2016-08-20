var mongo = require('mongodb');

var loadUserLists = function(db, options, callback) {
  db.collection('wordlists')
    .find({userId:options.userId})
    .toArray(function(err, docs) {
      callback(docs);
    });
}

var saveNewList = function(db, data, options, callback) {
  if (data.name) {
    db.collection('wordlists')
      .insert({userId:options.userId, name:data.name},
        function(err, r) {
          callback(r);
        });
  }
}

var updateListName = function(db, data, options, callback) {
  var listId = new mongo.ObjectID(data._id);
  if (data.name) {
    db.collection('wordlists')
      .update(
        {_id: mongoId, listId:options.userId},
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

module.exports = {
  load: function(req, res) {
    var options = {userId: 'demoUser'};
    loadUserLists(mongo.DB, options, function(lists){
      lists.forEach(function(list) {list.count = list.wordIds ? list.wordIds.length : 0;});
      res.status(200).send({"lists": lists});
    });
  },
  save: function(req, res) {
    var options = {userId: 'demoUser'};
    saveNewList(mongo.DB, req.body, options, function(r){
      res.status(200).send(r);
    })
  },
  updateList: function(req, res) {
    var options = {userId:'demoUser'};
    updateUserList(mongo.DB, req.body, options, function(err, result){
      res.status(200).json({
          message: 'Success',
          obj: result
      });
    });
  },
  updateName: function(req, res) {
    var options = {userId:'demoUser'};
    updateListName(mongo.DB, req.body, options, function(err, result){
      if (err) {
          return res.status(500).json({
              title: 'Error updating list',
              error: err
          });
      }
      res.status(200).json({
          message: 'Success',
          obj: result
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
