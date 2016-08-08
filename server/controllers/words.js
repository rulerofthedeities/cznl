var mongo = require('mongodb'),
    answers = require("./answers");

var countWords = function(db, options, callback) {
  var filter = buildFilter(options);

  db.collection('wordpairs')
    .find(filter)
    .count(function(err, count) {
      callback(count);
  })
}

var loadWords = function(db, options, callback) {
  var filter = buildFilter(options);
  //Fetch words + their answer and lists for the user
  console.log(filter);
  db.collection('wordpairs')
    .find(filter)
    .limit(options.maxwords)
    .toArray(function(err, docs) {
      //Fetch answer and list for each word for this user
      var wordIds = [];
      docs.forEach(function(doc){
        wordIds.push(doc._id.toString());
      })

      if (options.answers) {
        answers.getAnswersInDoc(options.userId, wordIds, function(answers){
          //Map answers to docs
          callback(docs, answers);
        })
      } else {
        callback(docs);
      }
      
    })
}

var getCats = function(db, options, callback) {
  db.collection('wordpairs')
    .aggregate([
      {$unwind: "$categories" },
      {$match:{categories: {$regex:options.query, $options:"i"}}},
      {$limit:options.max},
      {$group:{_id:"all", cats:{$addToSet:"$categories"}}},
      {$sort:{cats: 1}},
      {$project:{_id:0, cats:1}}
    ]).toArray(function(err, docs) {
      if (docs.length > 0) {
        callback(docs[0]);
      } else {
        callback(null);
      }
    });
}

var saveNewWord = function(db, options, data, callback) {
  if (data && data.word) {
    let wordToSave = data.word;
    wordToSave.userId = data.userId;

    db.collection('wordpairs')
      .insert(wordToSave,
        function(err, r) {
          callback(r);
        });
  }
}

var updateWord = function(db, options, data, callback) {
  var word = data.word;
  var mongoId = new mongo.ObjectID(word._id);

  delete word._id;
  
  db.collection('wordpairs')
    .update(
    {userId: data.userId, _id:mongoId}, 
    {$set: word},
      function(err, r){
        callback(r);
      });

}

var buildFilter = function(options) {
  var filterArr = [];

  if (options.isWordFilter) {
    let word = options.start ? "^" + options.word : options.word;
    filterArr.push('"cz.word":{"$regex":"' + word + '",' + '"$options":"i"}');
  } else {
    if (options.level >= 0) {
      filterArr.push('"level":' + options.level);
    }
    if (options.tpe != "all") {
      filterArr.push('"tpe":"' + options.tpe + '"');
    }
    if (options.cat != "all") {
      filterArr.push('"categories":"' + options.cat + '"');
    } 
  }
  var filter = '{' + filterArr.join(',') + '}';
  return JSON.parse(filter);
}

module.exports = {
  load: function(req, res) {
    var options = {
      userId:'demoUser',
      level:parseInt(req.query.l), 
      answers:req.query.a === "1" ? true: false, 
      tpe:req.query.t, 
      cat:req.query.c, 
      word:req.query.w, 
      isWordFilter:req.query.wf === "1" ? true: false,
      start:req.query.s === "1" ? true: false, 
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
      loadWords(mongo.DB, options, function(docs, answers){
        res.status(200).send({"words": docs, "answers": answers});
      });
    }
  },
  save: function(req, res) {
    var options = {};
    saveNewWord(mongo.DB, options, req.body, function(r){
      res.status(200).send(r);
    })
  },
  update: function(req, res){
    var options = {};
    updateWord(mongo.DB, options, req.body, function(r){
      res.status(200).send(r);
    });
  },
  cats: function(req, res){
    var options = {
      query: req.query.search, 
      max: req.query.max ? parseInt(req.query.max, 10) : 20
    };
    getCats(mongo.DB, options, function(docs){
      if (docs){
        res.status(200).send(docs);
      } else {
        res.status(204).send();
      }
    });
  }
}
