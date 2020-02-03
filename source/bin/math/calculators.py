import math


class VectorCalculator:
    def __init__(self) -> None:
        super().__init__()

    def normalize_vector(self, vector: list):
        """
        Метод для нормализации вектора по норме Евклида
        :param vector:
        :return:
        """
        norm = 0
        for elem in vector:
            norm = norm + elem ** 2
        norm = math.sqrt(norm)
        normalized_vector = []
        for elem in vector:
            normalized_vector.append(elem / norm)
        return normalized_vector
