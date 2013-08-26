# Billboard

Got screens in your home or office? Wish you could magically zap stuff onto them? Here's an API for that.

Simply open a unique URL in a fullscreen web browser on as many or as few screens as you'd like, and issue calls to the  Billboard API. Your content will appear on the screens you've specified, through the magic of node.js and Socket.io.

## Setup 

1. Deploy a copy of Billboard to a location of your choice. (We like Heroku.)
2. On a computer connected to a screen, open the following URL: http://{host_location}/screens/{screen_name_of_your_choice}. (We suggest using Google Chrome in fullscreen mode.)
3. Repeat Step 2 for as many screens as you have. 
4. Issue calls to the API (see below) and your content appears.

## API Usage

### Display content on a screen

You can several types of content.

  - *Images* If you pass the url to an image (must end in .jpg, .jpeg, .gif, .png) it will be displayed full screen.
  - *Youtube* If you pass a url that looks like it is to a youtube video, it will attempt to play it, a revert back to default content once the video is done.
  - *Iframe* If you pass any other url, it will be displayed in an full screen iframe
  - *Text* Any other text will be displayed as white text with a black background.

`curl -X POST -d content="<Path to Image/Youtube/Iframe or Text>" http://{billboard_instance_url}/api/screens/home`

You can *force* how to handle the content by adding the `action` param.

`curl -X POST -d action=image -d content="<Path to Image" http://{billboard_instance_url}/api/screens/home`

To make the content the *default*. It reverts to the default after showing other content. set `default=true` 

`curl -X POST -d defult=true -d content="<Path to Image" http://{billboard_instance_url}/api/screens/home`


response:
```javascript
{
  "status": "ok"
}
```


### List Available Screens
List the names of screens that are currently available:

`curl http://{billboard_instance_url}/api/screens`

response:
```javascript
    {   
      "screens": [
        "all", // all currently connected screens
        "right",
        "left"
        ]
    }
```

### Reload a screen
Runs `window.location.reload()` to force get a screen to update:

`curl http://{billboard_instance_url}/api/screens/:name:/reload`

response:
```javascript
{   
  "status": "ok"
}
```

##Use the built in client to change the content.

![billboard screenshot](https://f.cloud.github.com/assets/26278/1030113/d0a682ae-0eaa-11e3-88d5-b5a435f580ec.png)

If you browse to any screen `http://{billboard_instance_url}/screens/{screen_name}` you can edit the content directly 
from that screen. Simply click the gear to open the screen control. Then paste your image, youtube or other webpage 
link. Or just type some text to share with your coworkers.

