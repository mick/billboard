var socket = io.connect();

var defaultContent;

var show = function(data) {
  clear();
  executeAction(contentType(data), data);
};

var contentType = function(data){
  if (data.action !== undefined) {
    return data.action;
  } else if(data.content !== undefined) {
    return guessActionByContent(data.content);
  }

}
var guessActionByContent = function(content) {
  var imageRegex = /.+(jpg|jpeg|gif|png)$/;
  var videoRegex = /.+youtube\.com\/watch.+/;
  var urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;


  if (imageRegex.test(content)) {
    return "image";
  }
  if (videoRegex.test(content)) {
    return "video";
  }
  if (urlRegex.test(content)){
    return "iframe"
  }
  return "text";
};

var executeAction = function(action, data) {
  if(action === "image"){
    showImage(data);
  } else if(action === "video"){
    showVideo(data);
  } else if(action === "iframe"){
    showIFrame(data);
  } else if(action === "text"){
    showText(data);
  }
};

var showImage = function(data) {
  $("div.content").css({"background-image": "url('" + data.content + "')"});
  $("div.content").addClass("show");
};

var showIFrame = function(data) {
  $("div.content").html("<iframe frameborder='0' src='"+data.content+"' />");
  $("div.content").addClass("show");
};

var showText = function(data) {

  var $h1 = $("<h1 class='text-content'></h1>").text(data.content);

  $("div.content").html($h1);
  $("div.content").addClass("show");
};


var showVideo = function(data) {
  // This one is going to be a bit more complex.
  // To start only support youtube, but it would be great to return to the deault 
  // at the end of the video.


  $("div.content").html("<div id='ytapiplayer'></div>");

  var video_id = data.content.split('v=')[1];
  var ampersandPosition = video_id.indexOf('&');
  if(ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }

  var height = $(window).height();

  window.onYouTubePlayerReady = function(playerId) {
    ytplayer = document.getElementById("ytplayer");
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    ytplayer.loadVideoById({'videoId': video_id, 'startSeconds': data.start, 'endSeconds': data.end });
    ytplayer.playVideo();
  };

  window.onytplayerStateChange = function(newState) {
    console.log("Player's new state: " , newState);
    if(newState ===  0)
      $("div.content").removeClass("show");
  };

  swfobject.embedSWF('http://www.youtube.com/v/' + video_id + '?enablejsapi=1&playerapiid=ytplayer&version=3',
                     'ytapiplayer', '100%', height, '8', null, null, 
                     { allowScriptAccess: 'always' }, { id: 'ytplayer' }); 

  $("div.content").addClass("show");
};

var clear = function() {
  $(".offscreen").removeClass("show");
  $("div.content").html("");
  $("div.content").css({"background-image": ""});
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

  if(contentType(data) !== "video"){
    setTimeout(function(){
      clear();
      if(defaultContent !== undefined) {
        show(defaultContent);
      }
    }, data.maxTime || 15000);
  }
});

$(function(){

  $(".settings-menu .post-content").click(function(){


    var data= {content:$("#content").val()};

    if($("#setdefault").is(":checked")){
      data["default"] = "true";
    }
    var screen  = $("#screen").val();


    $.ajax("/api/screens/"+screen, {data:data, method:"POST", success:function(data){
      console.log("ret: ",data);
    }});

  });

  $(".settings-menu .close").click(function(){
    $(".settings-container").hide();
  });
  $(".settings-menu-btn").click(function(){
    $(".settings-container").show();
  });

  $.ajax("/api/screens", {success:function(data){
    console.log("screens:", data);
    for(s in data.screens){
      $("#screen").append("<option value='"+data.screens[s]+"'>"+data.screens[s]+"</option>")
    }

  }});

  var settingTimeout =0;
  $(window).mousemove(function(){
    console.log("mouse")
    $(".settings-menu-btn").addClass("show");
    clearTimeout(settingTimeout);
    settingTimeout= setTimeout(function(){
      $(".settings-menu-btn").removeClass("show");
    }, 3000);

  })


})
