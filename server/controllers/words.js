var mongo = require('mongodb'),
    assert = require("assert");

var loadWords = function(db, options, callback) {
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
  console.log('filter', filter);
  console.log('filter', JSON.parse(filter));
  db.collection('wordpairs')
    .find(JSON.parse(filter))
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
      tpe:req.query.t, 
      cat:req.query.c, 
      maxwords:parseInt(req.query.m)
    };
    loadWords(mongo.DB, options, function(docs){
      res.status(200).send({"words": docs});
    });
  }
}
