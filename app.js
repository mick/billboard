var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

app.use(express.bodyParser());


var screens = {};

app.get('/api/screens', function(req, res){
  //list screens along with current status
  var list = [];

  for(s in screens){
    list.push(s);
  }

  res.send({"screens":list});
});

app.post('/api/screens/:name', function(req, res){

  if(screens[req.params.name] !== undefined){

    for(s in screens[req.params.name]){
      var socket = screens[req.params.name][s];
      console.log(req.body)
      socket.emit('display', req.body);
    }
  }
  res.send({"status": "ok"});
});

app.get('/screen/:name', function(req, res){
  res.sendfile('index.html');
});

app.use('/', express.static(__dirname + '/')); 

io.sockets.on('connection', function (socket) {

  socket.on('screen', function (data) {

    if(screens[data.screenName] === undefined)
      screens[data.screenName] = [];
    screens[data.screenName].push(socket)
    socket.screenName = data.screenName;
    console.log("connect", data);
  });
  socket.on('disconnect', function () {

    if(screens[socket.screenName].indexOf(socket) >=0)
      delete screens[socket.screenName][screens[socket.screenName].indexOf(socket)];
    console.log("disconnect");
  });
});

