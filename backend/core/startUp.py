#!/usr/bin/python

import sys
import os
sys.path += [os.path.abspath('/src/libraries')]

from commonFunctions import singleInstance, logAndError, tee
from datetime import datetime
from exchange import sendEmail
from inspect import currentframe as CF # help with logging
from inspect import getframeinfo as GFI # help with logging
import pexpect 
import threading
import time as t


# Determine where main program files are stored
directory = os.path.dirname(os.path.realpath(__file__))


#  production,  development, basic
runMode = os.getenv('runMode')
#runMode = 'production'


# Make sure only one instance of this program is running
single, fp = singleInstance(directory, os.getpid())
if not single:
    sys.exit(1)


# Error and log handling
sendEmailError = False
exitFlag = [0]
errMode = 'pf' # p = print to screen, f = print to file,  e = end program
logMode = 'pf' # p = print to screen, f = print to file, u = restart program on code update
errorFileAddress = '/log/backend_startup.err'
logFileAddress = '/log/backend_startup.log'
outputlog = open(errorFileAddress, "a")
sys.stderr = tee(sys.stderr, outputlog, sendEmailError, os.getenv('DJANGO_SUPERUSER_EMAIL'), os.getenv('DJANGO_SUPERUSER_USERNAME'))



# Use 1st given argument as log mode, 2nd as error mode
try:
	logMode = sys.argv[1]
	errMode = sys.argv[2]
except:
	pass
msg = logAndError(errorFileAddress, logFileAddress, errMode, logMode)



# Main threading code
class mainThreadClass(threading.Thread):
	def __init__(self):
		threading.Thread.__init__(self)
	def run(self):
		PIDMessage = 'Start up program started: %s'%os.getpid()
		msg.log(PIDMessage)
		mainThread()
		msg.log('Thread: main complete')



def mainThread():
    manageLocation = '/src/web/'
    msg.log(f'Docker start up mode: { runMode }')


    commands = [
        'ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/'
    ]

    if runMode == 'initialise':
        commands.append(f'python { manageLocation }manage.py makemigrations')
        commands.append(f'python { manageLocation }manage.py migrate')
        commands.append(f'python { manageLocation }manage.py createsuperuser --noinput')
        #commands.append(f'python { manageLocation }manage.py loaddata GHNHSFT_initialData.json')
    elif runMode == 'production' or runMode == 'productionWithDebug':
        commands.append('/etc/init.d/nginx restart')
        commands.append('uwsgi --emperor /etc/uwsgi/vassals')
    elif runMode == 'nginx':
        commands.append('/etc/init.d/nginx restart')
    elif runMode == 'development':
        commands.append('python /src/web/manage.py runserver 0.0.0.0:8080')

    for c in commands:
        childUpdate = pexpect.run(c)
        msg.log(childUpdate)

    return



# Loop threading code
class loopThreadClass(threading.Thread):
	def __init__(self):
		threading.Thread.__init__(self)
	def run(self):
		loopThread()
		msg.log('Thread: loop exited\n')



def loopThread():
    msg.log(f'Thread: loop running...')
    while exitFlag[0] == 0:
        t.sleep(10)

    #sendEmail('Dr Mark Bailey', ['mark.bailey5@nhs.net'], 'Dr Mark A Bailey', 'Spiritum Duo App exited', 'SpiritumDuo App exited')


if __name__ == '__main__':
    # Create new threads
    threadMain = mainThreadClass()
    threadLoop = loopThreadClass()
    # Start new Threads
    threadMain.start()
    threadLoop.start()


