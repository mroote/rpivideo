from flask import Blueprint, render_template, flash, request, redirect, url_for, session
from flask.ext.login import login_user, logout_user, login_required

from rpivideo.extensions import cache
from rpivideo.forms import LoginForm, VideoForm, RegistrationForm
from rpivideo.models import User, db
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
@login_required
def video():
    form = VideoForm()
    
    if form.validate_on_submit():
        flash("POSTED: {0}, {1}".format(form.url.data, form.vid_output.data))
        return redirect('/')

    return render_template("video.html", form=form)


@main.route("/restricted")
@login_required
def restricted():
    return "You can only see this if you are logged in!", 200
