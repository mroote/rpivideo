var VideoForm = React.createClass({
    render: function() {
        return (
            <form>
              <div className="form-group">
                <label for="url">Video URL:</label>
                <input type="text" className="form-control" id="urlinput" placeholder="URL" name="url" />
              </div>
              <div className="form-group">
                <select className="form-control" name="output">
                  <option>HDMI</option>
                  <option>Local</option>
                  <option>Both</option>
                </select>
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
        );
    }
});

var VideoApp = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <VideoForm />
                </div>
                <div className="col-md-4">
                    <div className="btn-group" role="group" aria-label="...">
                        <a href="/video/play"><button type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-play"></span>
                        </button></a>
                        <a href="/video/stop"><button type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-stop"></span>
                        </button></a>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <VideoApp />,
    document.getElementById('video-app')
);