import json

import pandas as pd


class VMFObject:
    # Имя файла с данными
    filename: str
    # Список собственных чисел
    eigenvalues: list
    # Список координат узлов. В каждой ячейке списка хранится массив из трех элементов (x,y,z)
    coordinates: pd.DataFrame
    # Словарь вида {'eigenvalue':'eigenvector'}
    eigendict: dict
    # Массив в каждой ячейке которого хранится словарь вида {'x':[vector],'y':[vector],'z':[vector],'phi':[vector]}
    transformed_matrix: list

    def __init__(self, filename=None, eigenvalues=None, coordinates=None, eigendict=None,
                 transformed_matrix=None) -> None:
        self.filename = filename
        self.eigenvalues = eigenvalues
        self.coordinates = coordinates
        self.eigendict = eigendict
        self.transformed_matrix = transformed_matrix

    def to_json(self):
        """
            Преобразовать объект в строку формата JSON
            :rtype: str
        """
        pass


class VMFVector:
    # Имя файла с данными
    filename: str
    # Cобственное число
    eigenvalue: float
    # координаты векторв
    coordinates: pd.DataFrame
    # Значения собственного вектора
    eigencoordinates: dict

    def __init__(self, filename=None, eigenvalue=None, coordinates=None, eigencoordinates=None, name=None):
        self.filename = filename
        self.eigenvalue = eigenvalue
        self.coordinates = coordinates
        self.eigencoordinates = eigencoordinates
        if name == "" or name == None:
            name = f'Vector with Value = {self.eigenvalue}'
        else:
            self.name = name

    def json_dict(self):
        coord = {'x': self.coordinates['x'].to_list(), 'y': self.coordinates['y'].to_list(),
                 'z': self.coordinates['z'].to_list()}
        coordinates = json.dumps(coord)
        ecoordinates = json.dumps(self.eigencoordinates)
        json_obj = {'filename': self.filename, 'eigenvalue': self.eigenvalue,
                    'coordinates': coordinates, 'eigencoordinates': ecoordinates, 'name': self.name}
        return json_obj
