var mongo = require('mongodb'),
    assert = require("assert");

var loadWords = function(db, options, callback) {
  var level = options.level >=0 ? {'level':options.level} : {};
  db.collection('wordpairs')
    .find(level)
    .limit(options.maxwords)
    .toArray(function(err, docs) {
      assert.equal(null, err);
      callback(docs);
    })
}

module.exports = {
  load: function(req, res) {
    var options = {
      level:parseInt(req.query.l), 
      maxwords:parseInt(req.query.m)
    };
    loadWords(mongo.DB, options, function(docs){
      res.status(200).send({"words": docs});
    });
  }
}
