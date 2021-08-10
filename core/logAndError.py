# to handle errors

import time
import sys
import threading


errorDict = {
	# <= 100 are arduino error numbers
	1 : 'wrong message length received',
	2 : 'message received, but not for this node',
	3 : 'provided wrong message length',
	4 : 'node number does not excist',
	5 : 'unknown RF sender',
	6 : 'serial message received, stored in log file',
	7 : 'incorrect function number received',
	8 : 'Binary message not received',
	9 : 'some sort of error',
	10 : 'NoneType received',
	11 : 'wrong data received',
	12 : 'non-digit or not a separator passed to arduino RF code',
	
	# Numbers > 100 are reserved for computer errors
	101 : 'not currently assigned...',
	102 : 'problem with sending/receiving emails',
	103 : 'socket port already in use, cannot establish connection',
	104 : 'wrong data type received from client via socket',
	105 : 'a server error on ''Sockets'' has occured',
	106 : 'wrong data received',
	107 : 'wrong data in dictionary',
	108 : 'missing string keyword',
	109 : 'could not find day',
	110 : 'wrong message received from Django web server!',
	111 : 'problem with arduino - linino bridge data',
	112 : 'error with variable data',
	113 : 'error with Bridgeclient',
	114 : 'program ended by exiting main thread',
	115 : 'file data error, resetting file data',
	116 : 'user terminated program'
	}


class logAndError:
	def __init__(self, errorAddress, logAddress, errMode, logMode):
		self.errorAddress = errorAddress
		self.logAddress = logAddress
		self.errMode = errMode
		self.logMode = logMode
		self.lock = threading.RLock()
	
	
	def error(self, message=None, lineNumber=None, errorNr=None, errMode=None, exitFlag=[0]):
		timeStamp = time.strftime("%d/%m/%y %H:%M")
		with self.lock:
			if errMode == None:
				errMode = self.errMode
			if message == None:
				if errorNr == None:
					message = 'The error number must be defined if no message provided!' %errorNr
				elif errorNr not in errorDict:
					message = 'The error number %s is not in the error dictionary!\n' %errorNr
				else:
					message = '%s: ' %timeStamp
					if errorNr <101:
						message += 'Arduino error'
					else:
						if lineNumber == None:
							message += 'Computer error'
						else:
							message += 'Computer error line number %s - ' %lineNumber
					message += '%d: %s!' %(errorNr, errorDict[errorNr])
			else:
				if lineNumber == None:
					message = '%s: %s' %(timeStamp, message)
				else:
					message = '%s: %s, line %s' %(timeSterrModeamp, message, lineNumber)
	
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
		timeStamp = time.strftime("%d/%m/%y %H:%M")
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
	
	
