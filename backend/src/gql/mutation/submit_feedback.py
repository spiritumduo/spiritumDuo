from graphql import GraphQLResolveInfo
from authentication.authentication import needsAuthorization
from SdTypes import Permissions
from containers import SDContainer
from email_adapter import EmailAdapter, EmailAttachment
from .mutation_type import mutation
from config import config
import base64    
import re
from dependency_injector.wiring import Provide, inject


@mutation.field("submitFeedback")
@needsAuthorization([Permissions.AUTHENTICATED])
@inject
async def resolve_submit_feedback(
    obj=None, info: GraphQLResolveInfo = None, input: dict = None,
    email_service: EmailAdapter = Provide[SDContainer.email_service]
) -> bool:
    
    feedback_image = EmailAttachment(
        name="feedback_image.png",
        data=base64.b64decode(
                re.sub(
                    r"^data:image\/[a-zA-Z]+;base64,",
                    '',
                    input['screenshotBase64']
                )
            ),
        is_inline=False,
    )

    message_body=(
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

    recipients = str(config['FEEDBACK_EMAIL_RECIPIENTS']).split(";")

    await email_service.send_email(
        recipients=recipients,
        subject="User feedback received",
        body=message_body,
        attachments=[feedback_image]
    )

    return {"success": True}
