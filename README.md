# Billboard

Got screens in your home or office? Wish you could magically zap stuff onto them? Here's an API for that.

Simply open a unique URL in a fullscreen web browser on as many or as few screens as you'd like, and issue calls to the  Billboard API. Your content will appear on the screens you've specified, through the magic of node.js and Socket.io.

## Setup 

1. Deploy a copy of Billboard to a location of your choice. (We like Heroku.)
2. On a computer connected to a screen, open the following URL: http://{host_location}/screens/{screen_name_of_your_choice}. (We suggest using Google Chrome in fullscreen mode.)
3. Repeat Step 2 for as many screens as you have. 
4. Issue calls to the API (see below) and your content appears.

## API Usage

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

### Display content on a screen

#### Image
Show an image on a screen:

`curl -X POST -d action=image -d url="<Path to Image>" http://{billboard_instance_url}/api/screens/home`

response:
```javascript
{
  "status": "ok"
}
```

#### Video
Plays a a youtube video.

`curl -X POST -d action=video -d url="<Youtube URL>" http://{billboard_instance_url}/api/screens/home`

response:
```javascript
{
  "status": "ok"
}
```


### Coming Soon:

#### Default content
Content that shows when other content expires.

#### Minimum and Maximum time
Show content for a specified length of time.

#### iframe
Shows web content within an iframe on the screen.

##### carousel
Rotate through content items on  a timer.

#### Persistence
Save the display settings so that they persist through server / client restarts.
