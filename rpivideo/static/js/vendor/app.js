var VideoForm = React.createClass({
    getInitialState: function() {
        return {url: '', 
                video_title: this.props.video_title,
                format: this.props.format, 
                duration: this.props.duration,
                height: this.props.height, 
                width: this.props.width,
                output: 'hdmi'};
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
    getVideoInfo: function() {
        $.ajax({
            url: '/video/info',
            dataType: 'json',
            success: function(data) {
                var date = new Date(data.duration * 1000).toISOString().substr(11, 8);
                this.setState({video_title: data.title,
                               format: data.format,
                               duration: date.toString(),
                               height: data.height,
                               width: data.width})
            }.bind(this)
        });
    },
    submitButton: function() {
        clearInterval(infoInterval)
        var infoInterval = setInterval(this.getVideoInfo, 5000);
    },
    render: function() {
        return (
        <div>
            <div className="alert alert-info alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <p>Now playing: {this.state.video_title}</p>
                <p>Duration: {this.state.duration}</p>

            </div>
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
            <button onClick={this.submitButton} type="submit" className="btn btn-default">Submit</button>
            </form>
        </div>
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
                if (data.playing === true) {
                    this.setState({playing: true,
                                    duration: this.setDuration()});
                    console.log(data);
                    this.getProgress()
                    var progessTimer = setInterval(this.getProgress, 15000);
                    var updateTimer = setInterval(this.updateTimer, 1000)
                } 
                if (data.playing == false) {
                    clearInterval(progressTimer)
                    clearInterval(updateTimer)
                }
            }.bind(this)
        });
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
        clearInterval(this.progressTimer)
        clearInterval(this.updateTimer)
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
        var percentComplete = percentComplete.toString().substr(0, 4)
        console.log(this.state.position)
        var positionDate = new Date(this.state.position * 1000).toISOString().substr(11, 8);
        if (this.state.duration) {
            var durationDate = new Date(this.state.duration * 1000).toISOString().substr(11, 8);
        }
        console.log(this.state.duration)
        //var durationDate = new Date(this.state.duration * 1000).toISOString().substr(11, 8);

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
                <p>Position: {positionDate}, Duration: {durationDate}, Percent watched: {percentComplete}</p>
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
});

var VideoApp = React.createClass({
    getInitialState: function() {
        return {video_title: "",
                format: "",
                duration: "",
                height: "",
                width: "",
                progress: "",
                position: "",
                playing: "",
                duration: ""}
    },

    render: function() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <VideoForm video_title={this.state.video_title} 
                            format={this.state.format}
                            duration={this.state.duration}
                            height={this.state.height}
                            width={this.state.width}
                    />
                </div>
                <div className="col-md-4">
                    <VideoControls 
                        progess={this.state.progress}
                        position={this.state.position}
                        playing={this.state.playing}
                        duration={this.state.duration}
                    />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <VideoApp progress={0} position={0} duration={0} playing={false} video=""/>,
    document.getElementById('video-app')
);
