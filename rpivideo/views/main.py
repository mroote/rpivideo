from flask import Blueprint, render_template, flash, request, redirect, url_for, session, jsonify
from flask.ext.login import login_user, logout_user, login_required

from rpivideo.extensions import cache
from rpivideo.forms import LoginForm, RegistrationForm
from rpivideo.models import User, db
from rpivideo.video import Player

main = Blueprint('main', __name__)


@main.route('/', methods=["GET", "POST"])
@cache.cached(timeout=1000)
def home():
    global player

    if request.method == 'POST':
        try:
            url = request.form['url']
        except Exception as e:
            return jsonify(Success=False, message="Please provide video URL: {}".format(e))
        try:
            output = request.form['output']
        except Exception as e:
            return jsonify(Success=False, message="Please provide video output format: {}".format(e))
        try:
            player = Player(url=url, output=output)
            #player.insert_vid_db()
            return jsonify(success=True, message='Video added to play queue')
        except Exception as e:
            return jsonify(error=e)

    return render_template("video.html")


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


@main.route("/video/play", methods=["GET", "POST"])
def video_playpause():
    global player

    if not player:
        return

    player.toggle_pause()
    return jsonify(success=True)


@main.route("/video/stop", methods=["GET", "POST"])
def video_stop():
    global player

    try:
        if not player:
            return
    except NameError:
        print("Video player was not found")

    player.stop()

    return jsonify(success=True, message="Video has been stopped")


@main.route("/video/ff", methods=["GET"])
def video_ff():
    global player

    try:
        player
    except NameError:
        return jsonify(succes=False, message="No Video found")

    player.forward()

    return jsonify(success=True)


@main.route("/video/rw", methods=["GET"])
def video_rw():
    global player

    try:
        player
    except NameError:
        return jsonify(succes=False, message="No Video found")

    player.backward()

    return jsonify(success=True)


@main.route("/video/ff30", methods=["GET"])
def video_ff30():
    global player

    try:
        player
    except NameError:
        return jsonify(succes=False, message="No Video found")

    player.jump_30()

    return jsonify(success=True)


@main.route("/video/rw30", methods=["GET"])
def video_rw30():
    global player

    try:
        player
    except NameError:
        return jsonify(succes=False, message="No Video found")

    player.back_30()

    return jsonify(success=True)


@main.route("/video/info", methods=["GET", "POST"])
def video_info():
    global player

    try:
        player
    except NameError:
        return jsonify(succes=False, message="No Video found")

    info = player.print_player

    return jsonify(info)


@main.route("/video/position", methods=["GET"])
def video_position():
    global player

    try:
        player
    except NameError:
        return jsonify(succes=False, message="No Video found")

    position = player.get_position()
    duration = player.get_duration()
    playing = player.check_running()

    return jsonify(position=position,
                   duration=duration,
                   playing=playing)


@main.route("/restricted")
@login_required
def restricted():
    return "You can only see this if you are logged in!", 200
