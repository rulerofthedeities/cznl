var mongo = require('mongodb'),
    answers = require("./answers");

var countWords = function(db, options, callback) {
  var filter = buildFilter(options);

  db.collection('wordpairs')
    .count(filter, function(err, count) {
      callback(count);
  })
}

var loadWords = function(db, options, callback) {
  var filter = buildFilter(options);
  //Fetch words + their answer and lists for the user
  db.collection('wordpairs')
    .find(filter)
    .limit(options.maxwords)
    .toArray(function(err, docs) {
      //Fetch answer and list for each word for this user
      var wordIds = [];
      if (docs) {
        docs.forEach(function(doc){
          wordIds.push(doc._id.toString());
        })
      }

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

var getAutoListWords = function(db, options, callback) {
  switch (options.autoId) {
    case "1": 
      //get incorrect answers for user;
      answers.getIncorrectWordIds(options, function(ids){
        callback(ids);
      });
    break;
    case "2": 
      //get correct answers for user;
      answers.getCorrectWordIds(options, function(ids){
        callback(ids);
      });
    break;
    case "3": 
      //get all already answered for this user
      answers.getAnsweredWordIds(options, function(ids){
        callback(ids);
      });
    break;
    case "4": 
      //get all answers with %<60 for this user
      answers.getPercentageWordIds(options, function(ids){
        callback(ids);
      });
    break;
    default: callback(null);
  }
}

var getAllNotAnswered = function(db, options, callback) {
  //get all words for this user that do not have an answer
  var cursor = db.collection('wordpairs').find({});
  var list = [],
      sent = false;

  cursor.forEach(function(doc) { 
    answers.hasAnswer(doc._id, options.userId, function(result){
      if (!result) {
        if (list.length < options.maxwords) {
          list.push(doc);
        } else if (!sent) {
          sent = true;
          callback(list);
        }
      }
    })
  });
}

var getCats = function(db, options, callback) {
  db.collection('wordpairs')
    .aggregate([
      {$unwind: "$categories" },
      {$match:{categories: {$regex:options.query, $options:"i"}}},
      {$group:{_id:"$categories"}},
      {$sort:{_id: 1}},
      {$limit:options.max},
      {$project:{_id:0,name:"$_id"}}
    ]).toArray(function(err, docs) {
      if (docs && docs.length > 0) {
        callback(docs);
      } else {
        callback(null);
      }
    });
}

var saveNewWord = function(db, options, data, callback) {
  if (data && data.word) {
    var wordToSave = data.word;
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
  var filterArr = [],
      filter;

  if (options.isWordFilter) {
    //Search for a specific word
    var word = options.start ? "^" + options.word : options.word;
    filter = {'cz.word':{"$regex": word, "$options":"i"}};
  } else if(options.listId || options.autoId) {
    //Get words by ID
    filter = { _id: { $in: options.ids } };
  } else {
    //Get list of words from filter
    if (options.level >= 0) {
      filterArr.push('"level":' + options.level);
    }
    if (options.tpe != "all") {
      filterArr.push('"tpe":"' + options.tpe + '"');
    }
    if (options.cat != "all") {
      filterArr.push('"categories":"' + options.cat + '"');
    } 
    filter = JSON.parse('{' + filterArr.join(',') + '}');
  }
  return filter;
}

module.exports = {
  load: function(req, res) {
    var options = {
      userId:'demoUser',
      listId:req.query.listid,
      autoId:req.query.autoid,
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
      if (req.query.listid) {
        //Get word ids from the wordlist first
        answers.getWordIds(options, function(ids){
          options.ids = ids;
          options.answers = true;
          loadWords(mongo.DB, options, function(docs, answers){
            res.status(200).send({"words": docs, "answers": answers});
          });

        }) 
      } else if (req.query.autoid) {
        //Get words for automated list
        var autoid = parseInt(req.query.autoid);
        if (autoid < 5) {
          getAutoListWords(mongo.DB, options, function(ids) {
            options.ids = ids;
              options.answers = true;
              loadWords(mongo.DB, options, function(docs, answers){
                res.status(200).send({"words": docs, "answers": answers});
              });
            })
        } else {
          // get autolist with words with no answers for this user
          getAllNotAnswered(mongo.DB, options, function(docs){
            res.status(200).send({"words": docs, "answers": null});
          })
        }
      } else {
        //Get words with filter data
        loadWords(mongo.DB, options, function(docs, answers){
          res.status(200).send({"words": docs, "answers": answers});
        });
      }
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
        res.status(200).send({"cats": docs});
      } else {
        res.status(204).send();
      }
    });
  }
}
