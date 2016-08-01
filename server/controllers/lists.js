var mongo = require('mongodb');

var loadLists = function(db, options, callback) {
  db.collection('wordlists')
    .find({userId:options.userId})
    .toArray(function(err, docs) {
      callback(docs);
    });
}

var getWordCount = function(db, options, callback) {
  db.collection('answers')
    .find({userId:options.userId, listIds:options.id})
    .count(function(err, count) {
      callback(count);
    });
}

module.exports = {
  load: function(req, res) {
    var options = {
      userId:'demoUser'
    };
    loadLists(mongo.DB, options, function(lists){
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
            res.status(200).send({"lists": lists});
          }
        });
      });
    });
  }
}
