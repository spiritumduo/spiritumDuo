from models.db import db, DATABASE_URL
from models import Session
from config import config
from asyncio import get_event_loop
from datetime import datetime

session_expiry = int(config['SESSION_EXPIRY_LENGTH'])


async def cleanup():
    await db.set_bind(DATABASE_URL)
    await Session.delete.where(Session.expiry < datetime.now()).gino.status()


loop = get_event_loop()
loop.run_until_complete(cleanup())
