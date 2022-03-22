import json


def _loadFromFile(fileName: str):
    returnValue: list = []
    try:
        _file = open(fileName, "r")
        returnValue = json.load(_file)
        _file.close()
    except FileNotFoundError:
        print(f"File '{fileName}' not found!")
    finally:
        return returnValue


TEST_RESULT_DATA = _loadFromFile('milestone_demo_data.json')

TEST_RESULT_DATA_SERIES = [
    _loadFromFile('patient1_demo_data.json'),
    _loadFromFile('patient2_demo_data.json'),
    _loadFromFile('patient3_demo_data.json'),
    _loadFromFile('patient4_demo_data.json'),
    _loadFromFile('patient5_demo_data.json'),
]
