var socket = io.connect('http://localhost');
socket.on('connect', function (data) {
  console.log(data);
  socket.emit('screen', { screenName: 'data' });
});
socket.on('display', function (data) {


  if(data.action === "image"){

    $("img.showImage").attr("src", data.url)
    $("img.showImage").fadeIn();
  }


});
