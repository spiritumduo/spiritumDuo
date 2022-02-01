import json

try:
    _TEST_RESULT_JSON=open("milestone_demo_data.json", "r")
    TEST_RESULT_DATA=json.loads(_TEST_RESULT_JSON)
except:
    TEST_RESULT_DATA=[]
