#rpivideo

A tool for streaming videos on the Raspberry Pi.  This lightweight video player 
can stream videos from youtube and other sources without running a full X server.

Uses youtube-dl to support many sources of video.  
Provides a webinterface for easy control of the video player.

Installation:

dependencies:
python3.4
libsqlite3-dev
sqlite3

Ensure python version is 3.4, if not install sqlite first then compile it.

Run "python manage.py runserver" to start the application in development mode.



