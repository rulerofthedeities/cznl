var mongo = require('mongodb');

var loadLists = function(db, options, callback) {
  db.collection('wordlists')
    .find({userId:options.userId})
    .toArray(function(err, docs) {
      callback(docs);
    });
}

var getWordCount = function(db, options, callback) {
  console.log("searching for ", options.id);
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
      lists.forEach(function(list) {
        console.log('list', list);
        var options = {
          userId:'demoUser',
          id: list._id.toString()
        };
        cnt++;
        getWordCount(mongo.DB, options, function(total){
          list.count = total;
          if (cnt == lists.length) {
            console.log('lists final', lists);
            res.status(200).send({"lists": lists});
          }
        });
      });
    });
  }
}
