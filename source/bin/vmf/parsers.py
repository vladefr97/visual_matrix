import numpy as np

from source.bin.vmf.objects import VMFObject
import pandas as pd


class VMFParser:
    # Number of coordinates x,y,z,phi
    COMPONENTS_NUMBER = 4
    eigenvalues = []
    eigenvectors = []
    coordinates: pd.DataFrame
    transformed_matrix = []
    eigendict = {}
    vector_names = []

    def __init__(self) -> None:
        # Number of eigenvalues and corresponding eigenvectors
        self.eigenN = None
        # Number of elements in single eigenvector
        self.eigenK = None

    def get_eigenvalues(self):
        return self.eigenvalues

    def parse_vmf_text(self, text: str, filename: str):
        """
        :rtype: VMFObject
        """
        self.eigenvalues = []
        self.eigenvectors = []
        self.transformed_matrix = []
        self.eigendict = {}
        try:
            vmf_data = text.split('\n')
            vmf_params = vmf_data[0].split()
            self.eigenN = int(vmf_params[0])
            self.eigenK = int(vmf_params[1])
            coord_num = int(self.eigenK / self.COMPONENTS_NUMBER)
            coords = []
            for i in range(0, coord_num):
                coords.append(np.asfarray(np.array(vmf_data[i + 1].split()), float))
            self.coordinates = pd.DataFrame(data=coords)
            self.coordinates.columns = ['x', 'y', 'z']
            for i in range(0, self.eigenN):
                self.eigenvalues.append(float(vmf_data[coord_num + 1 + i]))
                self.vector_names.append(f'Vector - {i + 1}')
                self.eigenvectors.append(
                    np.asfarray(np.array(vmf_data[coord_num + self.eigenN + 1 + i].split()), float))
                self.eigendict[self.eigenvalues[i]] = self.eigenvectors[i]
            self.generate_transformed_matrix()
            return VMFObject(filename=filename, eigenvalues=self.eigenvalues, coordinates=self.coordinates,
                             eigendict=self.eigendict, transformed_matrix=self.transformed_matrix,vector_names=self.vector_names)
        except Exception as e:
            print('Возникла ошибка: ' + str(e))

    def generate_transformed_matrix(self):
        for i in range(0, self.eigenN):
            ux, uy, uz, phi = [], [], [], []
            vector = self.eigenvectors[i]
            for j in range(0, self.eigenK, self.COMPONENTS_NUMBER):
                ux.append(vector[j])
                uy.append(vector[j + 1])
                uz.append(vector[j + 2])
                phi.append(vector[j + 3])
            self.transformed_matrix.append(dict(ux=ux, uz=uz, uy=uy, phi=phi))

    def get_vmf_vector(self):
        pass

    def get_transformed_vector(self):
        pass


class VMFFile():
    pass
