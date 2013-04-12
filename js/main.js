var socket = io.connect();



socket.on('connect', function (data) {

  var screenName = window.location.pathname.substring(8);
  if(screenName === "")
    screenName = "home"

  socket.emit('screen', { screenName: screenName });

});
socket.on('display', function (data) {


  $(".offscreen").removeClass("show");

  if(data.action === "image"){
    $("img.showImage").attr("src", data.url);
    $("img.showImage").addClass("show");
  }
  if(data.action === "iframe"){
    $("iframe.showIFrame").attr("href", data.url);
    $("iframe.showIFrame").addClass("show");
  }
  if(data.action === "video"){
    // This one is going to be a bit more complex.
    // To start only support youtube, but it would be great to return to the deault 
    // at the end of the video.

    $("div.showVideo").html("<object width='425' height='350'><param name='movie' "+
                            "value='http://www.youtube.com/v/OdT9z-JjtJk&autoplay=1'>"+
                            "</param><embed src='http://www.youtube.com/v/OdT9z-JjtJk&autoplay=1'"+
                            +" type='application/x-shockwave-flash' width='425' height='350'></embed></object>");
    $("div.showVideo").addClass("show");
  }


});
