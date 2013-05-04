var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

app.use(express.bodyParser());


var screens = {};

var saveDefault = function(screenName, data) {
  if(screenName === "all") {
    for(screen in screens){
      screen.default = data;
    }
  } else if(screenName !== undefined) {
    console.log(screens);
    screens[screenName].default = data;
  }
};

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

    for(s in screens[req.params.name].sockets){
      var socket = screens[req.params.name].sockets[s];
      socket.emit('reload');
    }
  }
  res.send({"status": "ok"});
});

app.post('/api/screens/:name', function(req, res){
  console.log(req, req.body);
  var screenName = req.params.name;

  if(req.body.default === "true") {
    saveDefault(screenName, req.body);
  }

  if(screenName === "all")
    io.sockets.emit('display', req.body);
  else if(screens[screenName] !== undefined){

    for(s in screens[screenName].sockets){
      var socket = screens[screenName].sockets[s];
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
      screens[data.screenName] = {};
    if(screens[data.screenName].sockets === undefined)
      screens[data.screenName].sockets = [];

    screens[data.screenName].sockets.push(socket)
    socket.screenName = data.screenName;

    // push default out if there is one for the screen
    if (screens[data.screenName].default !== undefined) {
      console.log("HERE");
      socket.emit('display', screens[data.screenName].default);
    }
  });
  socket.on('disconnect', function () {
    if(screens[socket.screenName].sockets.indexOf(socket) >=0)
      screens[socket.screenName].sockets.splice(screens[socket.screenName].sockets.indexOf(socket), 1);

    console.log("disconnect");
  });
});

