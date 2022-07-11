from dataclasses import dataclass
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from typing import List, Union
from exchangelib import (
    DELEGATE,
    Credentials,
    FileAttachment,
    Message,
    Configuration,
    Account,
    HTMLBody
)
from config import config


class EmailAdapterDoesNotExistException(Exception):
    """
    Raised when with attempted email send and no
    viable email adapter found
    """

@dataclass
class EmailAttachment:
    name: str = None
    data: str = None
    is_inline: bool = False

class EmailAdapter:
    def send_email(
        self,
        recipients: Union[List[str], None]= None,
        subject: str = None,
        body: str = None,
        attachments: List[EmailAttachment] = None,
    ):
        # I've made this in a way that if no email is provided it'll
        # send the email to the same email it's sending from. Much
        # easier than having to pull it from config if sending to yourself
        # anyway

        if recipients is None:
            if config['EMAIL_ADAPTER'].lower() == 'smtp':
                recipients=[config['SMTP_USER_EMAIL']]
            elif config['EMAIL_ADAPTER'].lower() == 'exchange':
                recipients=[config['EXCHANGE_USER_EMAIL']]

        if config['EMAIL_ADAPTER'].lower() == 'smtp':
            _send_smtp(
                recipients,
                subject,
                body,
                attachments
            )
        elif config['EMAIL_ADAPTER'].lower() == 'exchange':
            _send_exchange(
                recipients,
                subject,
                body,
                attachments
            )
        else:
            raise EmailAdapterDoesNotExistException()


def _send_exchange(
    recipients: List[str],
    subject: str,
    body: str,
    attachments: List[EmailAttachment]
):
    credentials: Credentials = Credentials(
        config['EXCHANGE_USER_EMAIL'], config['EXCHANGE_USER_PASSWORD']
    )
    # formats credentials how Exchange expects them

    server_configuration: Configuration = Configuration(
        credentials, config['EXCHANGE_SERVER_ADDRESS']
    )
    # this validates the user with the server. It doesn't just hold the data
    # and so this can actually throw if creds are incorrect or in case of a
    # server error

    account: Account = Account(
        config['EXCHANGE_USER_EMAIL'], config=server_configuration,
        access_type=DELEGATE,
    )
    # selects the mailbox/inbox to use (a user can have many mailboxes but one
    # set of credentials)

    html_body = HTMLBody(body)
    # as opposed to standard text, this let's us use HTML formatting
    # including embedding images

    message: Message = Message(
        account=account,
        to_recipients=recipients,
        subject=subject,
        body=html_body
    )
    # formats the message + data
    
    for attachment in attachments:
        message.attach(
            FileAttachment(
                name=attachment.name,
                content=attachment.data,
                is_inline=attachment.is_inline,
                content_id=attachment.name
            )
        )
    # even if it's not necessarily going to show as a typical attachment,
    # images still need to be attached to the message even if they're displayed
    # in the message. CID/content ID lets us embed images inline in the message.
    # This is an email thing, not limited to just Exchange.

    message.send()
    # fire the message off into the great abyss

    return True
    # returning true here, if anything happens wrt sending the email it'll
    # throw an exception. Since this isn't necessarly handling any input
    # from the user in ideal scenarios, it's ok to leave this unhandled as
    # there shouldn't be any errors if configured properly via envvars

def _send_smtp(
    recipients: List[str],
    subject: str,
    body: str,
    attachments: List[EmailAttachment]
):
    message = MIMEMultipart("related")
    message["Subject"] = subject
    message["From"] = config['SMTP_USER_EMAIL']

    message.attach(MIMEText(body, "html"))

    if attachments:
        for attachment in attachments:
            image = MIMEImage(attachment.data)
            image.add_header("Content-ID", "<{}>".format(attachment.name))
            message.attach(image)
    
    sender = smtplib.SMTP(config['SMTP_SERVER_ADDRESS'], config['SMTP_PORT'])
    # creates an SMTP session 

    sender.ehlo()
    # the EHLO command is an extended Hello (HELO) command as part
    # of enhanced SMTP (ESMTP). This starts the negotiation between the 
    # SMTP client and server wrt encryption, etc

    sender.starttls()
    # starttls is a command that basically requests the server move to
    # a secure connection (TLS/SSL)

    sender.login(config['SMTP_USER_EMAIL'], config['SMTP_USER_PASSWORD'])
    # sends the auth command to the SMTP server to authenticate the user

    sender.sendmail(
        config['SMTP_USER_EMAIL'],
        recipients,
        message.as_string()
    )
    # submits send command to server

    sender.quit()
    # closes the SMTP session
