#!/usr/bin/python

import os
import logging
from datetime import datetime
import logAndError # my own library to handle errors
import sys

# Determine where main program files are stored
directory = os.path.dirname(os.path.realpath(__file__))

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

commands = [
    'ln -s /etc/nginx/sites-available/spiritumDuo.conf /etc/nginx/sites-enabled/'
    #'ln -s /src/web/spiritumDuo_uwsgi.ini /etc/uwsgi/vassals/'
]

if runMode == 'initialise':
    commands.append(f'python { manageLocation }manage.py makemigrations')
    commands.append(f'python { manageLocation }manage.py migrate')
    commands.append(f'python { manageLocation }manage.py createsuperuser --noinput')
    #commands.append(f'python { manageLocation }manage.py loaddata GHNHSFT_initialData.json')
elif runMode == 'production':
    commands.append('/etc/init.d/nginx restart')
    commands.append('uwsgi --emperor /etc/uwsgi/vassals')
elif runMode == 'development':
    commands.append('python /src/web/manage.py runserver 0.0.0.0:8080')
# Run 'blank' mode
else:
    commands.append('tail -F anything')

for x in commands:
    os.system(x)



while True:
    t.sleep(10)


