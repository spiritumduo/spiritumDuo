from exchangelib import Message


class EmailAdapter:
    def send_email(
        self,
        message: Message = None
    ):
        message.send()
        return True
