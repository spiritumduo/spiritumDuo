from exchangelib import DELEGATE, Credentials, Account, Account, Message, Configuration, FileAttachment
#from dotenv import load_dotenv
import os
from datetime import datetime
from pathlib import Path


# Load environmental variables
#load_dotenv()

def emailNewReferral(fileName = None):
    print('Creating and sending email...')

    credentials = Credentials(os.getenv('djEmailAddress'), os.getenv('djEmailPassword'))
    config = Configuration(server=os.getenv('djServer'), credentials=credentials)
    accountA = Account(os.getenv('djEmailSharedSpiritumDuo'), config=config, autodiscover=False, access_type=DELEGATE)

    toName = 'Dr Mark Bailey'
    toEmail = ['mark.bailey5@nhs.net']
    pathway = 'lung cancer'

    '''
    filePath = f'/Users/markbailey/gitHub/spiritumDuoParent/spiritumDuo/requests/{ fileName }'
    file_to_attach = Path(filePath)
    with file_to_attach.open('rb') as f:
        content = f.read()
    '''

    m = Message(
        account = accountA,
        to_recipients = toEmail,
        subject = f'New { pathway } referral retrieved',
        body = f'''Dear { toName },\n\n \
A new { pathway } eRS referral has been retrieved at { datetime.today().strftime("%H:%M - %d/%m/%Y") }.\n\n
Please log into Spiritum Duo to triage this referral\n\n
Many thanks\n\n
*** This is an automated email from SpiritumDuo ***\n\n
*** This email account is not monitored ***''',
    )

    #m.attach(FileAttachment(name=fileName, content=content,))
    m.send()

    print('Email sent')


    '''
    # To get the 100 most recent emails
    for item in accountA.inbox.all().order_by('-datetime_received')[:100]:
        print(item.subject, item.sender, item.datetime_received)
    '''


def sendEmail(toEmail, fromWho, subject, body, fileName = None):
    #print('Creating and sending email...')

    credentials = Credentials(os.getenv('djEmailAddress'), os.getenv('djEmailPassword'))
    config = Configuration(server=os.getenv('djServer'), credentials=credentials)
    accountA = Account(os.getenv('djEmailSharedSpiritumDuo'), config=config, autodiscover=False, access_type=DELEGATE)

    m = Message(
        account = accountA,
        to_recipients = toEmail,
        subject = subject,
        body = body,
    )

    if fileName != None:
        filePath = f'/Users/markbailey/gitHub/spiritumDuoParent/spiritumDuo/requests/{ fileName }'
        file_to_attach = Path(filePath)
        with file_to_attach.open('rb') as f:
            content = f.read()
        m.attach(FileAttachment(name=fileName, content=content,))
    
    m.send()

    print('Email sent')

#sendEmail('Dr Mark Bailey', ['mark.bailey5@nhs.net'], 'Dr Mark A Bailey', 'Test', 'Test')
