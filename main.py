import json

if __name__ == '__main__':
    with open('./resources/test.json') as json_file:
        data = json.load(json_file)
    print(data)
