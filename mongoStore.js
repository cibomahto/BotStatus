var querystring = require("querystring");

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSONNative;


function storeMachineStatus(status) {
  host = "127.0.0.1";
  port = 27017;

  console.log("Connecting to " + host + ":" + port);
  var dbServer = new Server(host, port, {});
  var db = new Db('botStatus', dbServer, {native_parser:true});

  db.open(function(err, db) {
    db.collection("machineStatus", function(err, collection) {
      // TODO: only add once?
      status._id = status.machinename;

      console.log("Request to store: " + status);
      collection.save(status);
//      collection.insert(status);
    });
  });
}

function getAllMachineStatus(output, statusHandler) {
  host = "127.0.0.1";
  port = 27017;

  console.log("Connecting to " + host + ":" + port);
  var dbServer = new Server(host, port, {});
  var db = new Db('botStatus', dbServer, {native_parser:true});

  db.open(function(err, db) {
    db.collection("machineStatus", function(err, collection) {
      collection.find({}, function(err, cursor) {
        cursor.each(function(err, machine) {
          if(machine != null) {
            statusHandler(output, querystring.stringify(machine));
          }
          else {
            // TODO: any cleanup here?
            // TODO: callback here?
            output.write('</body></html>');
            output.end();
          }
        });
      });
    });
  });
}

exports.storeMachineStatus = storeMachineStatus;
exports.getAllMachineStatus = getAllMachineStatus;
