class VMFObject:
    # Имя файла с данными
    filename: str
    # Список собственных чисел
    eigenvalues: list
    # Список координат узлов. В каждой ячейке списка хранится массив из трех элементов (x,y,z)
    coordinates: list
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
