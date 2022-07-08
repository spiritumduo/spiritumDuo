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


class EmailAdapter:
    def send_email(
        self,
        recipients: List[str] = None,
        subject: str = None,
        body: Union[str, HTMLBody] = None,
        attachments: List[FileAttachment] = None,
    ):

        credentials: Credentials = Credentials(
            config['EXCHANGE_USER_EMAIL'], config['EXCHANGE_USER_PASSWORD']
        )
        server_configuration: Configuration = Configuration(
            credentials, config['EXCHANGE_SERVER_ADDRESS']
        )
        account: Account = Account(
            config['EXCHANGE_USER_EMAIL'], access_type=DELEGATE,
            config=server_configuration
        )

        message: Message = Message(
            account=account,
            to_recipients=recipients,
            subject=subject,
            body=body
        )

        for attachment in attachments:
            message.attach(attachment)

        message.send()
        return True
