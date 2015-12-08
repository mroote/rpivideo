from flask import Blueprint, render_template, flash, request, redirect, url_for, session, jsonify
from flask.ext.login import login_user, logout_user, login_required

from rpivideo.extensions import cache
from rpivideo.forms import LoginForm, VideoForm, RegistrationForm
from rpivideo.models import User, db
from rpivideo.video import Player

main = Blueprint('main', __name__)


@main.route('/')
@cache.cached(timeout=1000)
def home():
    return render_template('index.html')


@main.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        if form.remember.data:
            remember = form.remember.data
            print(remember)
        user = User.query.filter_by(username=form.username.data).one()
        login_user(user)

        flash("Logged in successfully.", "success")

        session['username'] = user.username

        return redirect(request.args.get("next") or url_for(".home"))

    return render_template("login.html", form=form)


@main.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():
        user = User(form.username.data, form.password.data)
        db.session.add(user)
        db.session.commit()

        session['username'] = user.username
        return redirect(url_for('.home'))

    return render_template('register.html', form=form)


@main.route("/logout")
def logout():
    logout_user()
    flash("You have been logged out.", "success")

    return redirect(url_for(".home"))


@main.route("/video", methods=["GET", "POST"])
def video():
    global player
    form = VideoForm()

    if form.validate_on_submit():
        url = form.url.data
        vid_output = form.vid_output.data
        player = Player(url=url, output=vid_output)
        player.insert_vid_db()
        return redirect('/video')

    return render_template("video.html", form=form)


@main.route("/video/play", methods=["GET", "POST"])
def video_playpause():
    global player
    form = VideoForm()

    if not player:
        return
    player.toggle_pause()
    return render_template("video.html", form=form)


@main.route("/video/stop", methods=["GET", "POST"])
def video_stop():
    global player
    form = VideoForm()

    try:
        if not player:
            return
    except NameError:
        print("Video player was not found")

    player.stop()

    return render_template("video.html", form=form)


@main.route("/video/info", methods=["GET", "POST"])
def video_info():
    global player
    info = player.print_player
    #position = player.get_position()
    print(position)
    print(info)
    print(type(info))

    return redirect("/video")


@main.route("/video/position", methods=["GET", "POST"])
def video_position():
    global player
    player_position = player.get_position()

    return jsonify(position=player_position)


@main.route("/restricted")
@login_required
def restricted():
    return "You can only see this if you are logged in!", 200
