/*jslint unparam: true, node: true, sloppy: true, nomen: true, maxerr: 50, indent: 2 */
var sys = require('sys'), TwilioClient = require('twilio').Client, client = new TwilioClient(process.env.account_sid, process.env.auth_token, process.env.hostname), Twiml = require('twilio').Twiml;
var net = require('net');
var arduinoTcp = null;

var tcpServer = net.createServer(function (socket) {
  console.log('tcp server running on port 1337');
});

tcpServer.on('connection', function (socket) {
  console.log('num of connections on port 1337: ' + tcpServer.connections);
  arduinoTcp = socket;

  socket.on('data', function (mydata) {
    console.log('received on tcp socket:' + mydata);
  });
});
tcpServer.listen(1337);
var phone = client.getPhoneNumber(process.env.phonenumber);
phone.setup(function () {
  phone.on('incomingSms', function (reqParams, res) {
    console.log('Received incoming SMS with text: ' + reqParams.Body);
    console.log('From: ' + reqParams.From);
    if (arduinoTcp === null) {
      res.append(new Twiml.Sms("I can't do that for you, Hal. I'm offline."));
    } else {
      if (reqParams.Body === '1') {
        arduinoTcp.write(reqParams.Body);
        res.append(new Twiml.Sms("You've turned me on!"));
      } else if (reqParams.Body === '0') {
        arduinoTcp.write(reqParams.Body);
        res.append(new Twiml.Sms("You've turned me off!"));
      } else {
        res.append(new Twiml.Sms("I can't do that for you, Hal."));
      }
    }
    res.send();
  });
});
