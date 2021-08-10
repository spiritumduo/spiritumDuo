#!/usr/bin/python

import os
import time as t
import logging
from datetime import datetime
import logAndError # my own library to handle errors
import sys

# Determine where main program files are stored
directory = os.path.dirname(os.path.realpath(__file__))

now = datetime.now()
current_time = now.strftime("%d/%m/%y - %H:%M:%S")

# Error and log handling
errMode = 'pf' # p = print to screen, f = print to file,  e = end program
errorFileAddress = f'{ directory }/error.log'
logFileAddress = f'{ directory }/startUp.log'
logMode = 'pf' # p = print to screen, f = print to file, u = restart program on code update
msg = logAndError.logAndError(errorFileAddress, logFileAddress, errMode, logMode)

#  production,  development, blank
runMode = os.getenv('runMode')
#runMode = 'blank'

manageLocation = '/src/web/'

msg.log(f'Docker start up mode: { runMode }')

if runMode == 'initialise':
    commands = {
        'makemigrations' : f'python { manageLocation }manage.py makemigrations',
        'migrate' : f'python { manageLocation }manage.py migrate',
        'superuser' : f'python { manageLocation }manage.py createsuperuser --noinput'
        #'uploadData' : f'python { manageLocation }manage.py loaddata GHNHSFT_initialData.json',
    }

elif runMode == 'production':
    commands = [
        'ln -s /etc/nginx/sites-available/spiritumDuo.conf /etc/nginx/sites-enabled/',
        'ln -s /src/web/spiritumDuo_uwsgi.ini /etc/uwsgi/vassals/',
        '/etc/init.d/nginx restart',
        'uwsgi --emperor /etc/uwsgi/vassals --uid www-data --gid www-data'
    ]
elif runMode == 'development':
    commands = [
        'python /src/web/manage.py runserver 0.0.0.0:8080'
    ]
# Run blank mode
else:
    commands = [
        'tail -F anything'
    ]

for x in commands:
    os.system(x)



while True:
    t.sleep(10)


