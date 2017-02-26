var mongo = require('mongodb'),
    jwt = require('jsonwebtoken'),
    answers = require("./answers"),
    userLists = require("./userlists"),
    response = require('../response');

var countWords = function(db, options, callback) {
  var filter = buildFilter(options);

  db.collection('wordpairs')
    .count(filter, function(err, count) {
      callback(err, count);
  })
}

var findWord = function(db, options, callback) {
  db.collection('wordpairs')
    .count({'cz.word':options.q}, function(err, count) {
      callback(err, count > 0);
  })
}

var loadFilterWords = function(db, options, callback) {
  var filter = buildFilter(options);

  db.collection('wordpairs')
    .find(filter)
    .limit(options.maxwords)
    .sort({'cz.word':1})
    .toArray(function(err, docs) {
      callback(err, docs);
    });
}

var loadWords = function(db, options, callback) {
  var filter = buildFilter(options);
  //Fetch words + their answer and lists for the user (note: $sample requires v3.2)
  db.collection('wordpairs')
    .aggregate([
      {$match:filter},
      {$sample:{size:options.maxwords}},
      {$limit:options.maxwords}
    ])
    .toArray(function(err, docs) {
      fetchAnswer(docs, options, callback);
    })
}

//Fetch answer and list for each word for this user
var fetchAnswer = function(docs, options, callback) {
  var wordIds = [];
  if (docs) {
    docs.forEach(function(doc){
      wordIds.push(doc._id);
    })
  }

  if (options.answers) {
    answers.getAnswersInDoc(options.userId, wordIds, function(err, answers){
      //Map answers to docs
      callback(err, docs, answers);
    })
  } else {
    callback(err, docs);
  }
}

var getAutoListWords = function(db, options, callback) {
  switch (options.autoId) {
    case "1": 
      //get incorrect answers for user;
      answers.getIncorrectWordIds(options, function(err, ids){
        callback(err, ids);
      });
    break;
    case "2": 
      //get correct answers for user;
      answers.getCorrectWordIds(options, function(err, ids){
        callback(err, ids);
      });
    break;
    case "3": 
      //get all already answered for this user
      answers.getAnsweredWordIds(options, function(err, ids){
        callback(err, ids);
      });
    break;
    case "4": 
      //get all answers with %<60 for this user
      answers.getPercentageWordIds(options, function(err, ids){
        callback(err, ids);
      });
    break;
    default: callback(null, null);
  }
}

var getAllNotAnswered = function(db, options, callback) {
  //get all words for this user that do not have an answer
  var cursor = db.collection('wordpairs').find({});
  var list = [],
      sent = false;
  
  cursor.forEach(function(doc) { 
    answers.hasAnswer(doc._id, options.userId, function(err, result){
      if (!result) {
        if (list.length < options.maxwords) {
          list.push(doc);
        } else if (!sent) {
          sent = true;
          callback(err, list);
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
      {$group:{_id:"$categories", total:{$sum:1}}},
      {$sort:{_id: 1}},
      {$limit:options.max},
      {$project:{_id:0,name:"$_id", total:1}}
    ]).toArray(function(err, docs) {
      if (docs && docs.length > 0) {
        callback(err, docs);
      } else {
        callback(err, null);
      }
    });
}

var saveNewWord = function(db, options, data, callback) {
  if (data && data.word) {
    var wordToSave = data.word;
    wordToSave.userId = options.userId;

    db.collection('wordpairs')
      .insertOne(wordToSave,
        function(err, result) {
          callback(err, result.ops[0]);
        });
  }
}

var updateWord = function(db, options, data, callback) {
  var word = data.word;
  var mongoId = new mongo.ObjectID(word._id);

  delete word._id;
  db.collection('wordpairs')
    .updateOne(
    {_id:mongoId}, 
    {$set: word},
      function(err, result){
        callback(err, result);
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
    //filterArr.push('"perfective":true');
    filter = JSON.parse('{' + filterArr.join(',') + '}');
  }
  return filter;
}

module.exports = {
  check: function(req, res) {
    var options = {q:req.query.search};
    findWord(mongo.DB, options, function(err, isFound){
      response.handleError(err, res, 500, 'Error searching for word', function(){
        response.handleSuccess(res, isFound, 200, 'Found word');
      });
    });
  },
  load: function(req, res) {
    var options = {
      userId:mongo.ObjectID(req.decoded.user._id),
      listId:req.query.listid ? mongo.ObjectID(req.query.listid) : null,
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
      countWords(mongo.DB, options, function(err, count){
        response.handleError(err, res, 500, 'Error counting words', function(){
          response.handleSuccess(res, count, 200, 'Counted words', 'total');
        });
      });
    } else {
      //Search for words
      if (req.query.listid) {
        //Get word ids from the wordlist first
        userLists.getWordIds(options, function(err, ids){
          options.ids = ids;
          options.answers = true;
          loadWords(mongo.DB, options, function(err, docs, answers){
            response.handleError(err, res, 500, 'Error fetching words', function(){
              response.handleSuccess(res, {"words": docs, "answers": answers}, 200, 'Fetched words');
            });
          });

        }) 
      } else if (req.query.autoid) {
        //Get words for automated list
        var autoid = parseInt(req.query.autoid);
        if (autoid < 5) {
          getAutoListWords(mongo.DB, options, function(err, ids) {
            options.ids = ids;
              options.answers = true;
              loadWords(mongo.DB, options, function(err, docs, answers){
                response.handleError(err, res, 500, 'Error fetching words', function(){
                  response.handleSuccess(res, {"words": docs, "answers": answers}, 200, 'Fetched words');
                });
              });
            })
        } else {
          // get autolist with words with no answers for this user
          getAllNotAnswered(mongo.DB, options, function(err, docs){
            response.handleError(err, res, 500, 'Error fetching not answered words', function(){
              response.handleSuccess(res, {"words": docs, "answers": null}, 200, 'Fetched answered words');
            });
          })
        }
      } else {
        //Get words with filter data
        if (options.isWordFilter){
          loadFilterWords(mongo.DB, options, function(err, docs){
            response.handleError(err, res, 500, 'Error filtering words', function(){
              response.handleSuccess(res, docs, 200, 'Filtered words', 'words');
            });
          });
        } else {
          //get words randomized
          loadWords(mongo.DB, options, function(err, docs, answers){
            response.handleError(err, res, 500, 'Error retrieving words', function(){
              response.handleSuccess(res, {"words": docs, "answers": answers}, 200, 'Loaded words');
            });
          });
        }
      }
    }
  },
  save: function(req, res) {
    var options = {};
    var set = new Set(req.decoded.user.access.roles);
    if (set.has("editWords")) {
      saveNewWord(mongo.DB, options, req.body, function(err, result){
        response.handleError(err, res, 500, 'Error saving word', function(){
          response.handleSuccess(res, result, 200, 'Saved word');
        });
      });
    } else {
      res.status(403).send('Not authorized to save new word.');
    }
  },
  update: function(req, res){
    var options = {};
    var set = new Set(req.decoded.user.access.roles);
    if (set.has("editWords")) {
      updateWord(mongo.DB, options, req.body, function(err, result){
        response.handleError(err, res, 500, 'Error updating word', function(){
          response.handleSuccess(res, result, 200, 'Updated word');
        });
      });
    } else {
      res.status(403).send('Not authorized to update word.');
    }
  },
  cats: function(req, res){
    var options = {
      query: req.query.search, 
      max: req.query.max ? parseInt(req.query.max, 10) : 20
    };
    getCats(mongo.DB, options, function(err, docs){
      response.handleError(err, res, 500, 'Error fetching categories', function(){
        if (docs){
          response.handleSuccess(res, docs, 200, 'Retrieved categories', 'cats');
        } else {
          response.handleSuccess(res, null, 204, 'No categories found');
        }
      });
    });
  }
}
