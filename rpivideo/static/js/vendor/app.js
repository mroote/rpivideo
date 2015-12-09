var VideoForm = React.createClass({
    getInitialState: function() {
        return {url: '', output: 'hdmi'};
    },
    handleUrlChange: function(e) {
        this.setState({url: e.target.value});
    },
    handleOutputChange: function(e) {
        console.log(e)
        this.setState({output: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var url = this.state.url.trim();
        var output = this.state.output.trim();
        console.log(url);
        console.log(output);
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
    render: function() {
        return (
            <div className="form-group">
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-play"></span>
                    </button>
                    <a href="/video/stop"><button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-stop"></span>
                    </button></a>
                </div>
            </div>
        );
    }
})

var VideoApp = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <VideoForm />
                </div>
                <div className="col-md-4">
                    <VideoControls />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <VideoApp />,
    document.getElementById('video-app')
);