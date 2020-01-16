import json

from flask import Flask, render_template, request, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

from source.bin.vmf.parsers import VMFParser
from source.conf import database, application
from source.database.db_handler import MySQLHandler

# from tkinter import filedialog as fd

app = Flask(__name__)
app.secret_key = application['secret-key']
# # Instance for vmf files parsing
# parser = VMFParser()
# List of VMF files
vmf_list = []
# Object for communication with MYSQL Database
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
    parser = VMFParser()

    vmf_object = parser.parse_vmf_text(data, filename)
    vmf_list.append(vmf_object)
    print(len(vmf_list))
    response = {'vmf_object': {
        'filename': vmf_object.filename,
        'vmf_id': len(vmf_list) - 1,
        'eigenvalues': vmf_object.eigenvalues

    }}
    return response


@app.route('/vector-view')
def vector_view():
    eigenvalue = float(request.values["eigenvalue"])
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values['vector_id'])

    vmf_obj = vmf_list[vmf_id]
    xs = vmf_obj.coordinates['x'].tolist()
    ys = vmf_obj.coordinates['y'].tolist()
    zs = vmf_obj.coordinates['z'].tolist()
    uxs = vmf_obj.transformed_matrix[vector_id]['ux']
    uys = vmf_obj.transformed_matrix[vector_id]['uy']
    uzs = vmf_obj.transformed_matrix[vector_id]['uz']
    phis = vmf_obj.transformed_matrix[vector_id]['phi']
    table_values = create_table_values(x=xs, y=ys, z=zs, ux=uxs, uy=uys, uz=uzs, phi=phis)
    filename = vmf_obj.filename
    vector_info = f"Файл {filename}, Вектор - {vector_id + 1}, Собственное значение - {eigenvalue}"
    return render_template('vector-view.html', table_values=table_values, vector_info=vector_info)


@app.route('/get-2d-dependence')
def get_2d_dependence():
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values['vector_id'])
    eigenvalue = float(request.values["eigenvalue"])
    dependencies = request.values['dependency_type'].split('-')

    vmf_obj = vmf_list[vmf_id]
    arguments = vmf_obj.coordinates[dependencies[1]].tolist()
    func_values = vmf_obj.transformed_matrix[vector_id][dependencies[0]]
    points = create_points(arguments=arguments, func_values=func_values)
    response = {'points': points}
    return response


def create_points(arguments, func_values):
    points = []
    for x, y in zip(arguments, func_values):
        points.append([x, y])
    return points


def create_table_values(x, y, z, ux, uy, uz, phi):
    length = len(x)
    table_values = []
    for i in range(0, length):
        table_values.append({
            'index': i,
            'x': x[i], 'y': y[i], 'z': z[i], 'ux': ux[i], 'uy': uy[i], 'uz': uz[i], 'phi': phi[i]
        })
    return table_values


@app.route('/read-file')
def read_file():
    # with open('./resources/test.json') as json_file:
    #     data = json.load(json_file)
    # return json.dumps({'data': data})

    # file = fd.askopenfilename()
    pass


if __name__ == '__main__':
    app.run(host='0.0.0.0')
