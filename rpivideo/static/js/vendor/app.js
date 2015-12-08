var VideoApp = React.createClass({
    render: function() {
        return (
                    <div className="btn-group" role="group" aria-label="...">
                        <a href="/video/play"><button type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-play"></span>
                        </button></a>
                        <a href="/video/stop"><button type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-stop"></span>
                        </button></a>
                    </div>
        );
    }
});

ReactDOM.render(
    <VideoApp />,
    document.getElementById('video-app')
);