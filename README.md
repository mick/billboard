![alt text](https://github.com/dthompson/billboard/raw/master/img/billboard.png "Billboard")


Billboard
====

Create an API for your screens.  

And I quote the great Tony Stark:

    Hold on one second, buddy. Let me see something here.
    Boy, I am good. I commandeered your screens.
    I need them. Time for a little transparency.


Options on all (coming soon):
 * setDefault
 * minTime
 * maxTime


####List Available Screens
List the name of screens that are currently available

    curl http://localhost:3000/api/screens

    {   
      "screens": [
        "right",
        "left"
        ]
    }

####Reload a screen
Runs `window.location.reload()`, great way to get a screen client to update.

    curl http://localhost:3000/api/screens/:name:/reload

    {   
      "status": "ok"
    }


#### Set Screen Display

#####Image
drop in full screen image (scaled, unless otherwise specified)

    curl -X POST -d action=image -d url="<Path to Image>" http://localhost:3000/api/screens/home

    {
      "status": "ok"
    }



####Coming Soon:

#####iFrame
sets the src of fullpage iframe

#####Video
Play video and return to default screen when that is completed.

#####Carousel
Set more then 1 default screen, and rotate through them on a timer.

#####Persistence
Save the display settings in Redis, to persist through server / client restarts


