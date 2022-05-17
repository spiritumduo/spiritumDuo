import json
from typing import Dict


def _loadFromFile(fileName: str) -> Dict:
    returnValue: list = []
    try:
        with open(fileName, "r") as file:
            returnValue = json.load(file)
    except FileNotFoundError:
        print(f"File '{fileName}' not found!")
        return None
    finally:
        return returnValue


def _getFileFromCharacteristics(
    hospitalNumber: str = None,
    pathwayName: str = None
) -> str:
    pathwayDirectory = None

    pathwayDirectory = "lungcancer" if (
        pathwayName.lower().find("lung cancer") > -1
    ) else pathwayDirectory

    pathwayDirectory = "lymphoma" if (
        pathwayName.lower().find("lymphoma") > -1
    ) else pathwayDirectory

    if not pathwayDirectory:
        return None

    fileName = f"patient{hospitalNumber[-1:]}.json"

    resultData = _loadFromFile(f"placeholder_data/{pathwayDirectory}/{fileName}")
    if not resultData:
        return _loadFromFile(f"placeholder_data/{pathwayDirectory}/fallback.json")

    return resultData


def getTestResultFromCharacteristics(
    typeName: str = None, hospitalNumber: str = None,
    pathwayName: str = None
) -> str:
    fallbackDescription = (
        "Vitae itaque illo ut. Non "
        "voluptatum aut qui porro dolores autem saepe."
    )

    resultData = _getFileFromCharacteristics(
        hospitalNumber, pathwayName
    )

    if resultData and resultData[typeName]:
        return resultData[typeName]['result']

    return fallbackDescription
