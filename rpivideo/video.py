import youtube_dl
import rpivideo.pyomxplayer as pyomx
from rpivideo.models import Video, db


class Player():
    def __init__(self, url='', output=''):
        if url:
            self.vid = get_url_video_format(url, 'best')
            self.url = self.vid['url']
            self.title = self.vid['title']
            self.vid_format = self.vid['vid_format']
            self.format_id = self.vid['format_id']
            self.upload_date = self.vid['upload_date']
            self.height = self.vid['height']
            self.width = self.vid['width']
            self.vid_id = self.vid['id']
            self.duration = self.vid['duration']
        if output:
            args = '-r -o {0}'.format(output)
        else:
            args = ''

        if url:
            self.player = pyomx.OMXPlayer(self.vid['url'], args=args)

    def get_position(self):
        return self.player.position

    def get_duration(self):
        return self.player.duration

    def check_running(self):
        return self.player.is_running()

    def toggle_subtitles(self):
        self.player.toggle_subtitles()

    def toggle_pause(self):
        self.player.toggle_pause()

    def player_info(self):
        final = {
            "vid": self.vid,
            "url": self.url,
            "title": self.title,
            "vid_format": self.vid_format,
            "format_id": self.format_id,
            "upload_date": self.upload_date,
            "height": self.height,
            "width": self.width,
            "vid_id": self.vid_id,
            "duration": self.duration,
        }

        return final

    def stop(self):
        self.player.stop()

    def forward(self):
        self.player.inc_speed()

    def backward(self):
        self.player.dec_speed()

    def jump_30(self):
        self.player.forward_30()

    def back_30(self):
        self.player.back_30()

    def insert_vid_db(self):
        VideoModel = db.session.query(Video).filter_by(vid_id=self.vid_id).first()
        if VideoModel:
            VideoModel.play_count += 1
            db.session.commit()
        else:
            video = Video(url=self.url,
                          title=self.title,
                          vid_format=self.vid_format,
                          format_id=self.format_id,
                          upload_date=self.upload_date,
                          height=self.height,
                          width=self.width,
                          vid_id=self.vid_id,
                          play_count=1,
                          duration=self.duration)
            db.session.add(video)
            db.session.commit()


def extract_info(url, options):
    ydl = youtube_dl.YoutubeDL(options)
    with ydl:
        result = ydl.extract_info(url, download=False)

    return result


def list_formats(ydl, info_dict):
    return ydl.list_formats(info_dict)


def get_url_video_format(url, format):
    video = {}

    ydl_opts = {
        'format': format,
        'simulate': True,
        'forcejson': True,
    }

    result = extract_info(url, ydl_opts)

    upload_date = ''
    height = ''
    width = ''

    if 'upload_date' in result:
        upload_date = result['upload_date']
    elif 'height' in result:
        height = result['height']
    elif 'width' in result:
        width = result['width']

    video = {'url': result['url'],
             'title': result['title'],
             'vid_format': result['format'],
             'format_id': result['format_id'],
             'duration': result['duration'],
             'upload_date': upload_date,
             'height': height,
             'width': width,
             'id': result['id']}

    return video
