# RPI Video

A tool for streaming videos on the Raspberry Pi.  This lightweight video player
can stream videos from youtube and other sources.

This application is build using Flask, pyomxplayer, and YouTube-DL to play many sources of video without the need of heavier software.  This player has been tested on the Raspberry Pi 1 and the Pi 2.

Frontend of the applicaiton is built using React.js.

## Installation

dependencies:
python3.4
libsqlite3-dev
sqlite3

Ensure python version is 3.4, if not install sqlite first then compile it.

Run "python manage.py runserver" to start the application in development mode.

## Usage

Access the interface through a web browser.  Video URL's can be submitted and the
video can be controlled via your browser

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Credits

Mitch Roote 2015

## License

MIT License