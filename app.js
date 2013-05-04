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
app.post('/api/screens/:name/reload', function(req, res){

  if(req.params.name === "all")
    io.sockets.emit('reload')
  else if(screens[req.params.name] !== undefined){

    for(s in screens[req.params.name]){
      var socket = screens[req.params.name][s];
      socket.emit('reload');
    }
  }
  res.send({"status": "ok"});
});
app.post('/api/screens/:name', function(req, res){

  if(req.params.name === "all")
    io.sockets.emit('display', req.body);
  else if(screens[req.params.name] !== undefined){

    for(s in screens[req.params.name]){
      var socket = screens[req.params.name][s];
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
  });
  socket.on('disconnect', function () {
    if(screens[socket.screenName].indexOf(socket) >=0)
      screens[socket.screenName].splice(screens[socket.screenName].indexOf(socket), 1);

    if(screens[socket.screenName].length === 0)
      delete screens[socket.screenName];

  });
});

