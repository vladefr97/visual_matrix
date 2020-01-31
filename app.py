import json

from flask import Flask, render_template, request, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

from source.bin.math.calculators import VectorCalculator
from source.bin.vmf.objects import VMFVector
from source.bin.vmf.parsers import VMFParser
from source.conf import database, application
from source.database.db_handler import MySQLHandler

# from tkinter import filedialog as fd

app = Flask(__name__)
app.secret_key = application['secret-key']
# Object for communication with MYSQL Database
db_handler = MySQLHandler(app=app, db_host=database['host'], db_name=database['name'], db_user=database['user'],
                          db_password=database['password'])

# List of VMF files
vmf_list = []
# List of db vectors in buffer
db_vectors = []


@app.route('/home')
def home():
    if session.get('user'):
        vectors = []
        if len(vmf_list) > 0:
            for i in range(0, len(vmf_list)):
                for j in range(0, len(vmf_list[i].eigenvalues)):
                    vectors.append({
                        'text': f'{vmf_list[i].vector_names[j]} ({vmf_list[i].filename}),Value = {vmf_list[i].eigenvalues[j]}',
                        'eigenvalue': vmf_list[i].eigenvalues[j],
                        'id': j,
                        'vmf_id': i
                    })
        else:
            vectors = None

        return render_template('home.html', user_login=session['login'], vectors=vectors, db_vectors=db_vectors)
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
    if _name == '' or _password == '' or _email == '':
        return render_template('outer-error.html', error="Нельзя вводить пустые значения данных регистрации!")

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
def upload_vector():
    filename = request.values["filename"]
    data = request.values["filedata"]
    parser = VMFParser()

    vmf_object = parser.parse_vmf_text(data, filename)

    if vmf_object is None:
        return "Inner Error"
    x = vmf_object.coordinates['x'].tolist()
    y = vmf_object.coordinates['y'].tolist()
    z = vmf_object.coordinates['z'].tolist()
    n = len(x)
    unique = check_unique_values(x, y, z, n)
    if not unique:
        return "Not Unique"
    vmf_list.append(vmf_object)
    print(len(vmf_list))
    response = {'vmf_object': {
        'filename': vmf_object.filename,
        'vmf_id': len(vmf_list) - 1,
        'eigenvalues': vmf_object.eigenvalues

    }}
    return response


def check_unique_values(x, y, z, n):
    array = []
    for i in range(0, len(x)):
        array.append(str(x[i]) + str(y[i]) + str(z[i]))
    check_set = set(array)
    return len(check_set) == n


@app.route('/vector-view')
def vector_view():
    eigenvalue = float(request.values["eigenvalue"])
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values['vector_id'])
    vector_type = int(request.values['vector_type'])
    if vector_type == 0:
        vmf_obj = vmf_list[vmf_id]
        xs = vmf_obj.coordinates['x'].tolist()
        ys = vmf_obj.coordinates['y'].tolist()
        zs = vmf_obj.coordinates['z'].tolist()
        uxs = vmf_obj.transformed_matrix[vector_id]['ux']
        uys = vmf_obj.transformed_matrix[vector_id]['uy']
        uzs = vmf_obj.transformed_matrix[vector_id]['uz']
        phis = vmf_obj.transformed_matrix[vector_id]['phi']
        filename = vmf_obj.filename
    else:
        db_vector = find_vector_by_id(vector_id)
        xs = db_vector['vector']['coordinates']['x']
        ys = db_vector['vector']['coordinates']['y']
        zs = db_vector['vector']['coordinates']['z']
        uxs = db_vector['vector']['eigencoordinates']['ux']
        uys = db_vector['vector']['eigencoordinates']['uy']
        uzs = db_vector['vector']['eigencoordinates']['uz']
        phis = db_vector['vector']['eigencoordinates']['phi']
        filename = db_vector['vector']['filename']

    table_values = create_table_values(x=xs, y=ys, z=zs, ux=uxs, uy=uys, uz=uzs, phi=phis)

    vector_info = f"Файл {filename}, Вектор - {vector_id + 1}, Собственное значение - {eigenvalue}"
    return render_template('vector-view.html', table_values=table_values, vector_info=vector_info,
                           user_login=session['login'])


@app.route('/get-2d-dependence')
def get_2d_dependence():
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values['vector_id'])
    eigenvalue = float(request.values["eigenvalue"])
    vector_type = int(request.values["vector_type"])
    dependencies = request.values['dependency_type'].split('-')
    if vector_type == 0:

        vmf_obj = vmf_list[vmf_id]
        arguments = vmf_obj.coordinates[dependencies[1]].tolist()
        func_values = vmf_obj.transformed_matrix[vector_id][dependencies[0]]
    else:
        db_vector = find_vector_by_id(vector_id)
        if db_vector != None:
            arguments = db_vector['vector']['coordinates'][dependencies[1]]
            func_values = db_vector['vector']['eigencoordinates'][dependencies[0]]

    points = create_points(arguments=arguments, func_values=func_values)
    response = {'points': points}

    return response


@app.route('/save-vector', methods=['POST'])
def save_vector():
    eigenvalue = float(request.values["eigenvalue"])
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values['vector_id'])
    vector_name = request.values['vector_name']
    if len(vector_name) > 500:
        return "Inner Error"
    vmf_obj = vmf_list[vmf_id]

    vmf_vector = VMFVector(filename=vmf_obj.filename, eigenvalue=eigenvalue, coordinates=vmf_obj.coordinates,
                           eigencoordinates=vmf_obj.transformed_matrix[vector_id], name=vector_name)
    status = save_vector_to_db(vmf_vector.json_dict())
    response = {'status': status}

    return response


@app.route('/my-vectors')
def my_vectros():
    if session.get('user'):

        vectors = select_all_vectors(session['user'])

        return render_template('my-vectors.html', user_login=session['login'], vectors=vectors)
    else:
        return render_template('outer-error.html', error="Неверный логин или пароль!")


@app.route('/buffer-add-vector')
def buffer_add_vector():
    vector_id = int(request.values['vector_id'])
    vmf_vector = select_vector_by_id(user_id=session['user'], vector_id=vector_id)
    db_vectors.append(vmf_vector)
    return {'status': 'ok'}


@app.route('/buffer-delete-vector')
def buffer_delete_vector():
    vector_id = int(request.values['vector_id'])
    eigenvalue = float(request.values['eigenvalue'])
    vmf_id = int(request.values['vmf_id'])
    vector_type = int(request.values['vector_type'])

    if vector_type == 0:
        delete_file_vector_from_buffer(vmf_id, eigenvalue)
    else:
        delete_db_vector_from_buffer(vector_id)

    return {'status': 'ok'}


@app.route('/delete-vector-from-db')
def delete_vector_from_db():
    vector_id = int(request.values['vector_id'])
    response = db_handler.execute_delete(f'delete from eigenvalues where e_id=%s', vector_id)
    print(response)
    return {'status': 'ok'}
    pass


# TODO:добавать проверку аутентификации
@app.route('/3d-view')
def threed_view():
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values['vector_id'])
    eigenvalue = float(request.values["eigenvalue"])
    vector_type = int(request.values['vector_type'])
    return render_template('3d-view.html', vector_id=vector_id, vmf_id=vmf_id, eigenvalue=eigenvalue,
                           vector_type=vector_type,
                           user_login=session['login'])


@app.route('/get-3d-points')
def get_3d_points():
    vmf_id = int(request.values["vmf_id"])
    vector_id = int(request.values["vector_id"])
    vector_type = int(request.values['vector_type'])
    dependency_type = request.values['dependency_type']
    calculator = VectorCalculator()
    if vector_type == 0:
        vmf_obj = vmf_list[vmf_id]
        x = vmf_obj.transformed_matrix[vector_id]['ux']
        y = vmf_obj.transformed_matrix[vector_id]['uy']
        z = vmf_obj.transformed_matrix[vector_id]['uz']
        func = vmf_obj.transformed_matrix[vector_id][dependency_type]

    else:
        db_vector = find_vector_by_id(vector_id)
        x = db_vector['vector']['eigencoordinates']['ux']
        y = db_vector['vector']['eigencoordinates']['uy']
        z = db_vector['vector']['eigencoordinates']['uz']
        func = db_vector['vector']['eigencoordinates'][dependency_type]
    func = calculator.normalize_vector(func)
    response = {'x': x, 'y': y,
                'z': z, 'func': func}
    return response


def find_vector_by_id(vector_id):
    db_vector: dict
    for elem in db_vectors:
        if elem['id'] == vector_id:
            db_vector = elem
            break
    return db_vector


def select_vector_by_id(user_id, vector_id):
    eigenvalue = db_handler.execute_select(
        f'select * from eigenvalues where e_user_id = {user_id} and e_id={vector_id}').data[0]

    db_vector = db_handler.execute_select(f'select * from eigenvectors where ev_eigenvalue_id = {eigenvalue[0]}').data
    text = f'{db_vector[0][5]}, Value = {eigenvalue[1]}'
    vmf_vector = {'id': eigenvalue[0], 'eigenvalue': eigenvalue[1], 'text': text, 'vector': {
        'coordinates': json.loads(db_vector[0][2]),
        'filename': db_vector[0][3],
        'eigencoordinates': json.loads(db_vector[0][4]),
        'name': db_vector[0][5]
    }}
    return vmf_vector


def select_all_vectors(user_id):
    eigenvalues = db_handler.execute_select(f'select * from eigenvalues where e_user_id = {user_id}').data
    vectors = []
    for eigenvalue in eigenvalues:
        vector = db_handler.execute_select(f'select * from eigenvectors where ev_eigenvalue_id = {eigenvalue[0]}').data
        text = f'{vector[0][5]}, Value = {eigenvalue[1]}'
        vectors.append({'id': eigenvalue[0], 'eigenvalue': eigenvalue[1], 'text': text, 'vector': {
            'coordinates': json.loads(vector[0][2]),
            'filename': vector[0][3],
            'eigencoordinates': json.loads(vector[0][4]),
            'name': vector[0][5]
        }})
    return vectors


def save_vector_to_db(json_vector: dict):
    answer = db_handler.execute_insert(
        'insert into eigenvalues (e_value, e_user_id) values (%s,%s)',
        (float(json_vector['eigenvalue']), int(session['user'])))
    insert_id = answer.data['lastid']

    db_response = db_handler.execute_insert(
        'insert into eigenvectors(ev_eigenvalue_id, coordinates, filename, eigen_coordinates,ev_name) values (%s,%s,%s,%s,%s)',
        (insert_id, json_vector['coordinates'], json_vector['filename'], json_vector['eigencoordinates'],
         json_vector['name']))

    return db_response.status


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


def delete_db_vector_from_buffer(vector_id):
    for i in range(0, len(db_vectors)):
        if db_vectors[i]['id'] == vector_id:
            del db_vectors[i]
            break


def delete_file_vector_from_buffer(vmf_id, eigenvalue):
    keys = list(vmf_list[vmf_id].eigendict.keys())
    index = 0
    for i in range(0, len(keys)):
        if eigenvalue == keys[i]:
            index = i
            break
    del vmf_list[vmf_id].eigendict[eigenvalue]
    del vmf_list[vmf_id].eigenvalues[index]
    del vmf_list[vmf_id].vector_names[index]
    del vmf_list[vmf_id].transformed_matrix[index]


if __name__ == '__main__':
    app.run(host='0.0.0.0')
