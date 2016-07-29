var mongo = require('mongodb'),
    assert = require("assert");

var countWords = function(db, options, callback) {
  var filter = buildFilter(options);
  db.collection('wordpairs')
    .find(filter)
    .count(function(err, count) {
      assert.equal(null, err);
      callback(count);
  })
}

var loadWords = function(db, options, callback) {
  var filter = buildFilter(options);

  db.collection('wordpairs')
    .find(filter)
    .limit(options.maxwords)
    .toArray(function(err, docs) {
      assert.equal(null, err);
      callback(docs);
    })
}

buildFilter = function(options) {
  var filterArr = [];
  if (options.level >= 0) {
    filterArr.push('"level":' + options.level);
  }
  if (options.tpe != "all") {
    filterArr.push('"tpe":"' + options.tpe + '"');
  }
  if (options.cat != "all") {
    filterArr.push('"categories":"' + options.cat + '"');
  }
  var filter = '{' + filterArr.join(',') + '}';
  return JSON.parse(filter);
}

module.exports = {
  load: function(req, res) {
    var options = {
      level:parseInt(req.query.l), 
      tpe:req.query.t, 
      cat:req.query.c, 
      maxwords:req.query.m ? parseInt(req.query.m) : 0,
      iscnt: req.query.cnt
    };

    if (req.query.cnt == '1') {
      //Count # of words
      countWords(mongo.DB, options, function(count){
        res.status(200).send({"total": count});
      });
    } else {
      //Search for words
      loadWords(mongo.DB, options, function(docs){
        res.status(200).send({"words": docs});
      });
    }
  }
}
