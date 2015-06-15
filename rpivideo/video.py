import youtube_dl
import rpivideo.pyomxplayer as pyomx
import time


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

        if url:
            self.player = pyomx.OMXPlayer(self.vid['url'])
    
    def toggle_pause(self):
        self.player.toggle_pause()
    
    def print_player(self):
        print(self.player.__dict__)

    def stop(self):
        self.player.stop()


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
    
    video = {'url': result['url'],
             'title': result['title'],
             'vid_format': result['format'],
             'format_id': result['format_id'],
             'upload_date': result['upload_date'],
             'height': result['height'],
             'width': result['width'],
             'id': result['id']}
    
    return video 

#player = Player('https://www.youtube.com/watch?v=XxVg_s8xAms')
#player.toggle_pause()
#player.print_player()
#time.sleep(30)
#player.stop()
