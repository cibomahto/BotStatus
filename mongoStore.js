var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server,
  BSON = require('mongodb').BSONNative;


function storeMachineStatus(status) {
  host = "127.0.0.1";
  port = 27017;

  console.log("Connecting to " + host + ":" + port);
  var dbServer = new Server(host, port, {});
  var db = new Db('botStatus', dbServer, {native_parser:true});

  db.open(function(err, db) {
    db.collection("machineStatus", function(err, collection) {
      // TODO: only add once?
      console.log("Request to store: " + status);
      collection.insert(status);
    });
  });
}

function getAllMachineStatus() {
  host = "127.0.0.1";
  port = 27017;

  console.log("Connecting to " + host + ":" + port);
  var dbServer = new Server(host, port, {});
  var db = new Db('botStatus', dbServer, {native_parser:true});

  db.open(function(err, db) {
    db.collection("machineStatus", function(err, collection) {
      var statuses = collection.find({});
      console.log(statuses);
      return statuses;
    });
  });
}

exports.storeMachineStatus = storeMachineStatus;
exports.getAllMachineStatus = getAllMachineStatus;
