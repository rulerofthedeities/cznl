var mongo = require('mongodb'),
    moment = require('moment'),
    response = require('../response');

var upsertProgress = function(db, options, data, callback) {
  const totalObj = {'totalWordsTested':data.total};
  const day = moment().format('YYYY-MM-DD');

  db.collection('progress')
    .update(
      {dt: day, userId:options.userId}, 
      {
        $setOnInsert:{dt: day, userId:options.userId},
        $inc:totalObj
      },
      {upsert: true},
      function(err, result){
        callback(err, result);
      }
    )
}

module.exports = {
  update: function(req, res){
    var options = {userId:mongo.ObjectID(req.decoded.user._id)};
    upsertProgress(mongo.DB, options, req.body, function(err, result){
      response.handleError(err, res, 500, 'Error upserting progress', function(){
        response.handleSuccess(res, result, 200, 'Upserted progress');
      });
    });
  }
}