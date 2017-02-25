var mongo = require('mongodb'),
  mongoClient = mongo.MongoClient,
  url = process.env.MONGODB_URI || "mongodb://localhost:27017/km-cznl";

exports.connect = function(callback){
  if (mongo.DB){
    return callback();
  }
  var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
  };
  mongoClient.connect(url, function(err, db) {
    if (err){
      console.log("Error connecting to mongodb");
      process.exit(1);
    } else {
      mongoClient.options = options;
      console.log("Connected to mongodb");
      mongo.DB = db;
      callback();
    }
  });
};

exports.get = function() {
  return mongo.DB;
};

exports.close = function(callback) {
  if (mongo.DB) {
    mongo.DB.close(function(err, result) {
      mongo.DB = null;
      callback(err);
    });
  }
};
