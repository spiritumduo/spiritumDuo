from datetime import datetime

def DateStringToDateObject(date_string):
    """
    Converts a date string to a data object
    :param date_string: Date in string format
    :return: DateTime object
    """
    if type(date_string)!=str:
        raise ValueError("expected string, got "+str(type(date_string)))
    try:
        date_object = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        date_object = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%f")
    return date_object