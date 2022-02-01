import json

try:
    _TEST_RESULT_FILE=open("milestone_demo_data.json", "r")
    TEST_RESULT_DATA=json.load(_TEST_RESULT_FILE)
    _TEST_RESULT_FILE.close()
except Exception as e:
    TEST_RESULT_DATA=[]
