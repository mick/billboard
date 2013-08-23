var url = require('url'),
    express = require("express"),
    redisURL = url.parse(process.env.REDIS_URL || "redis://redis:pass@localhost:6379"),
    redis = require("redis"),
    client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    client.auth(redisURL.auth.split(":")[1]);
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

app.use(express.bodyParser());


client.on("error", function (err) {
  console.log("Error " + err);
});


var screens = {};
client.hgetall("screens", function (err, savedScreens) {
    for(s in savedScreens){
      if(screens[s] === undefined){
        screens[s] = {};
      }
      screens[s].default = JSON.parse(savedScreens[s]);
    }
});

var saveDefault = function(screenName, data) {
  if(screenName === "all") {
    for(screen in screens){
      screens[screen].default = data;
      client.hset("screens", screen, JSON.stringify(data));
    }
  } else if((screenName !== undefined) && (screens[screenName] !== undefined)) {
    screens[screenName].default = data;
    client.hset("screens", screenName, JSON.stringify(data));
  }
};

app.all('*', function(req, res, next) {
  // allow request from other sites with cors
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/api/screens', function(req, res){
  //list screens along with current status
  var list = [];

  for(s in screens){
    if((screens[s].sockets != undefined) && (screens[s].sockets.length !== 0))
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
  var screenName = req.params.name;

  if(req.body.content === undefined)
    req.body.content = req.body.url;


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

app.get('/screen[s]?/:name', function(req, res){
  res.sendfile('static/index.html');
});

app.use('/', express.static(__dirname + '/static/')); 

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
      socket.emit('display', screens[data.screenName].default);
    }
  });
  socket.on('disconnect', function () {
    if(screens[socket.screenName].sockets.indexOf(socket) >=0)
      screens[socket.screenName].sockets.splice(screens[socket.screenName].sockets.indexOf(socket), 1);
  });
});

