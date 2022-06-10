from graphql import GraphQLResolveInfo
from authentication.authentication import needsAuthorization
from SdTypes import Permissions
from containers import SDContainer
from email_adapter import EmailAdapter
from .mutation_type import mutation
from exchangelib import DELEGATE, Credentials, FileAttachment, Message, Configuration, Account, HTMLBody
from config import config
import base64    
import re
from dependency_injector.wiring import Provide, inject


@mutation.field("submitFeedback")
@needsAuthorization([Permissions.AUTHENTICATED])
@inject
async def resolve_submit_feedback(
    obj=None, info: GraphQLResolveInfo = None, input: dict = None,
    email_adapter: EmailAdapter = Provide[SDContainer.email_service]
) -> bool:
    credentials: Credentials = Credentials(config['EXCHANGE_USER_EMAIL'], config['EXCHANGE_USER_PASSWORD'])
    server_configuration: Configuration = Configuration(credentials, config['EXCHANGE_SERVER_ADDRESS'])
    account: Account = Account(config['EXCHANGE_USER_EMAIL'], access_type=DELEGATE, config=server_configuration)

    # this might look a bit funky, encoding this image this way
    # afaik exchangelib doesn't really do embedding images via b64
    # what I've had to do here is strip the 'header' (for lack of a better word)
    # and then decode that into a binary so it can upload the attachment as a file

    feedback_image = FileAttachment(
        name="feedback_image.png",
        content=base64.b64decode(
                re.sub(
                    r"^data:image\/[a-zA-Z]+;base64,",
                    '',
                    input['screenshotBase64']
                )
            ),
        is_inline=False,
        content_id="feedback_image.png"
    )

    message: Message = Message(
        account=account,
        to_recipients=[config['EXCHANGE_USER_EMAIL']],
        subject="User feedback recieved",
    )

    message.attach(feedback_image)

    message.body=HTMLBody(
        f"""
        <html>
            <body>
                <b>User information</b><br />
                <b>Username:</b> {info.context['request']['user'].username}<br />
                <b>Name:</b> {info.context['request']['user'].firstName}&nbsp{info.context['request']['user'].lastName}<br />
                <b>Email address:</b> {info.context['request']['user'].email}<br />
                <b>Department:</b> {info.context['request']['user'].department}<br />
                <hr />
                <b>Written feedback:</b> {input['feedback']}<br />
                <hr />
                <b>Screenshot</b><br /><br/ >
                <img data-imagetype="AttachmentByCid" src="cid:feedback_image.png">
            </body>
        </html>
        """
    )

    await email_adapter.send_email(message)

    return {"success": True}
