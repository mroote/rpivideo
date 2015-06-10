from flask_wtf import Form
from wtforms import TextField, PasswordField, SelectField, BooleanField
from wtforms import validators

from rpivideo.models import User, Video


class LoginForm(Form):
    username = TextField(u'Username', validators=[validators.required()])
    password = PasswordField(u'Password', validators=[validators.optional()])
    remember = BooleanField(u'Remember Me', validators=[validators.optional()])

    def validate(self):
        check_validate = super(LoginForm, self).validate()

        # if our validators do not pass
        if not check_validate:
            return False

        # Does our the exist
        user = User.query.filter_by(username=self.username.data).first()
        print(user)
        if not user:
            self.username.errors.append('Invalid username or password')
            return False

        # Do the passwords match
        if not user.check_password(self.password.data):
            self.username.errors.append('Invalid username or password')
            return False

        return True


class RegistrationForm(Form):
    username = TextField("Username", validators=[validators.required()])
    password = PasswordField("Password", validators=[validators.required()])

    def validate(self):
        check_validate = super(RegistrationForm, self).validate()

        if not Form.validate(self):
            return False

        user = User.query.filter_by(username=self.username.data).first()
        if user:
            self.username.errors.append("That username is taken")
            return False
        else:
            return True


class VideoForm(Form):
    url = TextField(u'Url', validators=[validators.required()])
    vid_output = SelectField(u'Video Output', choices=[('hdmi', 'HDMI'), ('vga', 'VGA')]) 
    
    def validate(self):
        check_validate = super(VideoForm, self).validate()

        # if our validators do not pass
        if not check_validate:
            return False

        video = Video.query.filter_by(url=self.url.data).first()
        if video:
            self.url.errors.append('Video already exists')
            return False

        return True
