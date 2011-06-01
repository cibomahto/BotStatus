var querystring = require("querystring");
var mongoStore = require("./mongoStore");

function start(response, postData) {
  console.log("Request handler 'start' was called.");

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Botfarm monitor!");

    var machineStatuses = mongoStore.getAllMachineStatus();
 //   response.write(querystring.parse(machineStatuses));

    response.end();
}


function manualform(response, postData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    'Machine Name: <input type="text" name="machinename" cols="30"><br/>'+
    'Job Name: <input type="text" name="jobname" cols="30"><br/>'+
    'Status: <input type="text" name="status" cols="30"><br/>'+
    'Extruder Temp: <input type="text" name="extrudertemp" cols="30"><br/>'+
    'Platform Temp: <input type="text" name="platformtemp" cols="30">'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function renderMachineStatus(output, postData) {
  output.write('<div class="machineStatus">');
  output.write('<h2 class="machineTitle">' + querystring.parse(postData)["machinename"] + '</h2>');
  output.write('Job name: ' + querystring.parse(postData)["jobname"] + '<br/>');
  output.write('Status: ' + querystring.parse(postData)["status"] + '<br/>');
  output.write('Extruder Temp: ' + querystring.parse(postData)["extrudertemp"] + '<br/>');
  output.write('Platform Temp: ' + querystring.parse(postData)["platformtemp"] + '<br/>');
  output.write('</div>');
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  renderMachineStatus(response, postData);
  response.end();

  // TODO: filter the parameters we store?
  // TODO: keep a timestamp.
  mongoStore.storeMachineStatus(querystring.parse(postData));
}

exports.start = start;
exports.manualform = manualform;
exports.upload = upload;
