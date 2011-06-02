var querystring = require("querystring");
var mongoStore = require("./mongoStore");

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(
    '<html><head>'
    + '<title>Botfarm monitor!</title></head>'
    + '<link href="botStatus.css" rel="stylesheet" type="text/css">'
  );
  response.write('<body>');
  response.write('');

  mongoStore.getAllMachineStatus(response, renderMachineStatus);
//  response.end();
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
  switch(querystring.parse(postData)["status"]) {
    case "Ready":
      output.write('<div class="machineStatus machineStatusReady">');
      break;
    case "Building":
      output.write('<div class="machineStatus machineStatusBuilding">');
      break;
    case "Error":
      output.write('<div class="machineStatus machineStatusError">');
      break;
  }

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

  // TODO: filter the parameters we store? This implementation is classically insecure :-)
  // TODO: keep a timestamp.
  mongoStore.storeMachineStatus(querystring.parse(postData));
}

function botstatuscss(response, postData) {
  console.log("Request handler 'botstatuscss' was called.");
  response.writeHead(200, {"Content-Type": "text/css"});
  response.write(
    'body {'
    + 'background-color: white;'
    + '}'
    + 'div.machineStatus {'
    + '  width: 400px;'
    + '  margin: 10px;'
    + '  padding: 4px;'
    + '  border: 2px solid black;'
    + '}'
    + 'div.machineStatusReady {'
    + '  background-color: green;'
    + '}'
    + 'div.machineStatusBuilding {'
    + '  background-color: yellow;'
    + '}'
    + 'div.machineStatusError {'
    + '  background-color: red;'
    + '}'
  );
  response.end();
}

exports.start = start;
exports.manualform = manualform;
exports.upload = upload;
exports.botstatuscss = botstatuscss;
