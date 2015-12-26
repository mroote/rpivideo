var VideoForm = React.createClass({
    getInitialState: function() {
        return {url: '', output: 'hdmi'};
    },
    handleUrlChange: function(e) {
        this.setState({url: e.target.value});
    },
    handleOutputChange: function(e) {
        this.setState({output: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var urlSubmit = this.state.url.trim();
        var outputSubmit = this.state.output.trim();
        var dataSubmitted = {url: urlSubmit, output: outputSubmit}

        if (!urlSubmit || !outputSubmit) {
            return;
        }

        $.ajax({
            url: '/',
            type: 'POST',
            data: dataSubmitted,
            success: function(data) {
                this.props.infoClick();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(xhr, status, err.toString());
            }.bind(this)
        });

        this.setState({url: '', output: 'hdmi'})
    },
    render: function() {
        return (
        <form method="POST" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">Video URL:</label>
            <input type="text" className="form-control" id="urlinput" placeholder="URL" name="url" value={this.state.url} onChange={this.handleUrlChange}/>
          </div>
          <div className="form-group">
            <select className="form-control" ref="menu" name="output" value={this.state.output} onChange={this.handleOutputChange}>
              <option value="hdmi">HDMI</option>
              <option value="local">Local</option>
              <option value="both">Both</option>
            </select>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
        );
    }
});

var VideoControls = React.createClass({
    getInitialState: function() {
        return {progress: this.props.progress + '%',
                position: this.props.position,
                playing: this.props.playing,
                duration: this.setDuration()}
    },
    getProgress: function() {
        $.ajax({
            url: '/video/position',
            dataType: 'json',
            success: function(data) {
                this.setState({position: data.position, playing: data.playing})
                if (data.playing === false) {
                    clearInterval(this.progressTimer)
                    clearInterval(this.timer)
                }
            }.bind(this)
        });
    },
    setDuration: function(e) {
        $.ajax({
            url: '/video/position',
            dataType: 'json',
            success: function(data) {
                this.setState({duration: data.duration / 1000000})
            }.bind(this)
        });
    },
    updateTimer: function() {
        this.setState({position: this.state.position + 0.250});
        if (this.state.playing === false) {
            clearInterval(this.timer);
            this.setState({position: 0.0})
        }
    },
    playButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/play',
            success: function(data) {
                this.setState({playing: true});
                console.log(data);
            }.bind(this)
        });
        this.getProgress()
        this.progressTimer = setInterval(this.getProgress, 15000);
        this.timer = setInterval(this.updateTimer, 250)
    },
    stopButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/stop',
            success: function(data) {
                this.setState({playing: false, position: 0.0});
                console.log(data);
            }.bind(this)
        });
        clearInterval(this.progressTimer);
        this.progressTimer = false;
    },
    stepBackButton: function(e) {
        e.preventDefault();
        this.getProgress();
        $.ajax({
            url: '/video/rw30',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    stepForwardButton: function(e) {
        e.preventDefault();
        this.getProgress();
        $.ajax({
            url: '/video/ff30',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    rewindButton: function(e) {
        e.preventDefault();
        this.getProgress();
        $.ajax({
            url: '/video/rw',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    forwardButton: function(e) {
        e.preventDefault();
        this.getProgress();
        $.ajax({
            url: '/video/ff',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    render: function() {
        var percentComplete = this.state.position / this.state.duration * 100

        return (
            <div>
                <div className="form-group">
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-default" onClick={this.playButton}>
                            <span className="glyphicon glyphicon-play"></span>
                            <span className="glyphicon glyphicon-pause"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.stopButton}>
                            <span className="glyphicon glyphicon-stop"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.stepBackButton}>
                            <span className="glyphicon glyphicon-step-backward"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.rewindButton}>
                            <span className="glyphicon glyphicon-backward"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.forwardButton}>
                            <span className="glyphicon glyphicon-forward"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.stepForwardButton}>
                            <span className="glyphicon glyphicon-step-forward"></span>
                        </button>
                    </div>
                </div>
                <div className="progress">
                  <div className="progress-bar"
                       role="progressbar"
                       aria-valuenow={this.state.position}
                       aria-valuemin="0"
                       aria-valuemax={this.state.duration}
                       style={{width: percentComplete + '%'}}>
                  </div>
                </div>
            </div>
        );
    }
})

var VideoStatus = React.createClass({
    render: function() {
        if (this.props.show_info) {
            return(
                <div className="alert alert-info alert-dismissible" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p>Now Playing: {this.props.title}</p>
                    <p>Format: {this.props.vid_format}</p>
                </div>
            )
        } else {
            return null;
        }
    }
});

var VideoApp = React.createClass({
    getInitialState: function() {
        return {duration: "",
                format_id: "",
                height: "",
                width: "",
                title: "",
                upload_date: "",
                url: "",
                vid: "",
                vid_format: "",
                vid_id: "",
                show_info: false};
    },

    getVideoInfo: function() {
        this.setState({show_info: false})
        $.ajax({
            url: '/video/info',
            dataType: 'json',
            success: function(data) {
                this.setState({duration: data.duration,
                               format_id: data.format_id,
                               height: data.height,
                               width: data.width,
                               title: data.title,
                               upload_date: data.upload_date,
                               url: data.url,
                               vid: data.vid,
                               vid_format: data.vid_format,
                               vid_id: data.vid_id,
                               show_info: true})
            }.bind(this)
        });
    },

    render: function() {
        return (
            <div className="row">
                <VideoStatus duration={this.state.duration}
                            format_id={this.state.format_id}
                            height={this.state.height}
                            width={this.state.width}
                            title={this.state.title}
                            upload_date={this.state.upload_date}
                            url={this.state.url}
                            vid_format={this.state.vid_format}
                            show_info={this.state.show_info}
                />
                <div className="col-md-4">
                    <VideoForm infoClick={this.getVideoInfo} show-info={this.state.show_info}/>
                </div>
                <div className="col-md-4">
                    <VideoControls />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <VideoApp progress={0} position={0} duration={0} playing={false} video=""/>,
    document.getElementById('video-app')
);
