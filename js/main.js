var socket = io.connect();

var defaultContent;

var show = function(data) {
  clear();
  if(data.action === "image"){
    showImage(data);
  }
  if(data.action === "iframe"){
    showIFrame(data);
  }
  if(data.action === "video"){
    showVideo(data);
  }
};

var showImage = function(data) {
  $("div.showImage").css({"background-image": "url('"+data.url+"')",
                          "background-size": "contain",
                          "background-repeat": "no-repeat"});
  $("div.showImage").addClass("show");
};

var showIFrame = function(data) {
  $("div.showIFrame").html("<iframe frameborder='0' src='"+data.url+"' />");
  $("div.showIFrame").addClass("show");
};

var showVideo = function(data) {
  // This one is going to be a bit more complex.
  // To start only support youtube, but it would be great to return to the deault 
  // at the end of the video.

  var video_id = data.url.split('v=')[1];
  var ampersandPosition = video_id.indexOf('&');
  if(ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }

  var height = $(window).height();

  window.onYouTubePlayerReady = function(playerId) {
    ytplayer = document.getElementById("ytplayer");
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    ytplayer.playVideo();
  };

  window.onytplayerStateChange = function(newState) {
    console.log("Player's new state: " , newState);
    if(newState ===  0)
      $("div.showVideo").removeClass("show");
  };

  swfobject.embedSWF('http://www.youtube.com/v/' + video_id + '?enablejsapi=1&playerapiid=ytplayer&version=3',
                     'ytapiplayer', '100%', height, '8', null, null, 
                     { allowScriptAccess: 'always' }, { id: 'ytplayer' }); 

  $("div.showVideo").addClass("show");
};

var clear = function() {
  $(".offscreen").removeClass("show");
};

socket.on('connect', function (data) {

  var screenName = window.location.pathname.substring(8);
  if(screenName === "")
    screenName = "home"

  socket.emit('screen', { screenName: screenName });

});

socket.on('reload', function (data) {
  window.location.reload();
});

socket.on('display', function (data) {
  show(data);

  if (data.default === "true") {
    defaultContent = data;
  }

  setTimeout(function(){
    clear();
    if(defaultContent !== undefined) {
      show(defaultContent);
    }
  }, data.maxTime || 15000);
});
