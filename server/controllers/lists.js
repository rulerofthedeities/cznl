var mongo = require('mongodb'),
    async = require('async');

var loadUserLists = function(db, options, callback) {
  db.collection('wordlists')
    .find({userId:options.userId})
    .toArray(function(err, docs) {
      callback(docs);
    });
}

var loadAutoLists = function(db, options, callback) {
  var lists = [];
  var listTpes = [{
    collection:'answers', 
    name:'Foute antwoorden', 
    filter: {userId:options.userId, correct: false}
  },{
    collection:'answers', 
    name:'Juiste antwoorden', 
    filter: {userId:options.userId, correct: true}
  },{
    collection:'answers',
    name:'Reeds geteste woorden',
    filter: {userId:options.userId}

  }];

  var loadAutoList = function(tpe, callback) {
    db.collection(tpe.collection)
      .count(tpe.filter, function(err, count) {
        lists.push({name:tpe.name, count:count});
        callback();
      });
  }

  var loadAutoListNotLearned = function(callback) {
    db.collection('wordpairs')
      .count({}, function(err, allCount) {
        db.collection('answers')
          .count({userId:options.userId}, function(err, doneCount) {
            lists.push({name:'Nog niet geteste woorden', count:allCount - doneCount});
            callback();
          })
      });
  }

  async.eachSeries(listTpes, loadAutoList, function (err) {
    loadAutoListNotLearned(function(err){
      callback(lists);
    })
  });
}


var getWordCount = function(db, options, callback) {
  db.collection('answers')
    .count({userId:options.userId, listIds:options.id}, function(err, count) {
      callback(count);
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

var updateList = function(db, data, options, callback) {
  var mongoId = new mongo.ObjectID(data._id);
  if (data.name) {
    db.collection('wordlists')
      .update(
        {userId:options.userId, _id: mongoId},
        {$set:{name:data.name}}, 
        function(err, r) {
          callback(r);
        });
  }
}

var getUserListCount = function(lists, callback) {
  //For each list, get the number of words in the list
  var cnt = 0;
  var listLength = lists.length;
  lists.forEach(function(list) {
    var options = {
      userId:'demoUser',
      id: list._id.toString()
    };
    getWordCount(mongo.DB, options, function(total){
      cnt++;
      list.count = total;
      //Return lists only after we've got all the totals per list
      if (cnt === listLength) {
        callback(lists);
      }
    });
  });
}

module.exports = {
  load: function(req, res) {
    var listTpe = req.params.listTpe ? req.params.listTpe : 'user';
    var options = {
      userId:'demoUser'
    };
    if (listTpe === 'auto') {
      //Auto generated lists
      loadAutoLists(mongo.DB, options, function(listData){
        res.status(200).send({"lists": listData});
      })
    } else {
      //User generated lists
      loadUserLists(mongo.DB, options, function(lists){
        getUserListCount(lists, function(listData){
          res.status(200).send({"lists": listData});
        });
      });
    }
  },
  save: function(req, res) {
    var options = {
      userId:'demoUser'
    };
    saveNewList(mongo.DB, req.body, options, function(r){
      res.status(200).send(r);
    })
  },
  update:function(req, res) {
    var options = {
      userId:'demoUser'
    };
    updateList(mongo.DB, req.body, options, function(r){
      res.status(200).send(r);
    })
  }
}
