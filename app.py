import json
# from tkinter import filedialog as fd

from flask import Flask, render_template, request, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

from source.conf import database, application
from source.database.db_handler import MySQLHandler

app = Flask(__name__)
app.secret_key = application['secret-key']

db_handler = MySQLHandler(app=app, db_host=database['host'], db_name=database['name'], db_user=database['user'],
                          db_password=database['password'])


@app.route('/home')
def home():
    if session.get('user'):
        return render_template('home.html')
    else:
        return render_template('outer-error.html', error="Неверный логин или пароль!")


@app.route('/')
@app.route('/index')
def hello_world():
    return render_template('login.html')


@app.route('/register')
def enter_signup():
    return render_template('register.html')


@app.route('/register', methods=['POST'])
def signup():
    # read the posted values from the UI
    _name = request.form['inputName']
    _email = request.form['inputEmail']
    _password = request.form['inputPassword']

    # validate the received values
    if _name and _email and _password:
        _hashed_password = generate_password_hash(_password)
        db_answer = db_handler.call_create_delete_proc('registerUser', _name, _email, _hashed_password)
        success = db_answer.status
        data = db_answer.data
        if success:
            return redirect('/')
        else:
            return render_template('outer-error.html', error=data)


@app.route('/validateLogin', methods=['POST'])
def validate_login():
    _username = request.form['inputLogin']
    _password = request.form['inputPassword']
    data = db_handler.call_get_data_proc('getUserByLogin', _username).data
    # validate user data
    if len(data) > 0:
        _user_password = str(data[0][3])
        if check_password_hash(_user_password, _password):
            session['user'] = data[0][0]
            session['login'] = data[0][1]
            return redirect('/home')
        else:
            return render_template('outer-error.html', error='Неверный логин или пароль!')
    else:
        return render_template('outer-error.html', error='Неверный логин или пароль!')


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')


@app.route('/upload-vector', methods=['POST'])
def save_vector():
    filename = request.values["filename"]
    data = request.values["filedata"]
    print(filename)
    session['filename'] = filename
    session['filedata'] = data


@app.route('/read-file')
def read_file():
    # with open('./resources/test.json') as json_file:
    #     data = json.load(json_file)
    # return json.dumps({'data': data})

    # file = fd.askopenfilename()
    pass


if __name__ == '__main__':
    app.run()
