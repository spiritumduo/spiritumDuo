#Some small common functions

import sys
import os

from datetime import datetime
import fcntl
import select
import threading
import time as t



# Check if another instance of the program is running, if so, then stop second.
def singleInstance():
    pid_file = 'program2.pid'
    fp = open(pid_file, 'w')
    try:
        fcntl.lockf(fp, fcntl.LOCK_EX | fcntl.LOCK_NB)
        single = True
    except IOError:
        print("Program already running, stopping the second instance...")
        single = False
    return single, fp


# To handle errors raised by python interpreter
class tee:
    def __init__(self, _fd1, _fd2):
        self.fd1 = _fd1
        self.fd2 = _fd2

    def __del__(self):
        if self.fd1 != sys.stdout and self.fd1 != sys.stderr :
            self.fd1.close()
        if self.fd2 != sys.stdout and self.fd2 != sys.stderr :
            self.fd2.close()

    def write(self, text):
        self.fd1.write('%s: ' %t.strftime("%d/%m/%y %H:%M"))
        self.fd2.write('%s: ' %t.strftime("%d/%m/%y %H:%M"))
        self.fd1.write(text)
        self.fd2.write(text)

    def flush(self):
        self.fd1.flush()
        self.fd2.flush()


# To handle log and errors raised by programmer
class logAndError:
	def __init__(self, errorAddress, logAddress, errMode, logMode):
		self.errorAddress = errorAddress
		self.logAddress = logAddress
		self.errMode = errMode
		self.logMode = logMode
		self.lock = threading.RLock()
	
	def error(self, message, lineNumber=None, errMode=None, exitFlag=[0]):
		timeStamp = t.strftime("%d/%m/%y %H:%M")
		with self.lock:
			if errMode == None:
				errMode = self.errMode

			if lineNumber == None:
				message = '%s: %s' %(timeStamp, message)
			else:
				message = '%s: %s, line %s' %(timeStamp, message, lineNumber)
	
			# p = print to screen, f = print to file,  e = end program
			if 'p' in errMode:
				print(message)
			if 'f' in errMode and 'e' not in errMode:
				errorFile = open(self.errorAddress, 'a')
				errorFile.write(message + '\n')
				errorFile.close()
			if 'e' in errMode:
				message += ' - Ending Program...\n'
				errorFile = open(self.errorAddress, 'a')
				errorFile.write(message)
				errorFile.close()
				exitFlag[0] = 1
		return
	
	
	def log(self, logmsg, logMode=None):
		timeStamp = t.strftime("%d/%m/%y %H:%M")
		with self.lock:
			if logMode == None:
				logMode = self.logMode
			logmsg = '%s: %s' %(timeStamp, logmsg)
			if 'p' in logMode:
				print(logmsg)
			if 'f' in logMode:
				logFile = open(self.logAddress, 'a')
				logFile.write('%s\n' %logmsg)
				logFile.close()
		return