from models.db import db, DATABASE_URL
from models import OnPathway
from config import config
from asyncio import get_event_loop
from datetime import datetime

lock_expiry = int(config['DECISION_POINT_LOCKOUT_DURATION'])


async def cleanup():
    await db.set_bind(DATABASE_URL)
    await OnPathway.update.values(lock_user_id=None, lock_end_time=None)\
        .where(OnPathway.lock_end_time < datetime.now()).gino.status()


loop = get_event_loop()
loop.run_until_complete(cleanup())
