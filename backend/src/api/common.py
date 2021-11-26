from asgiref.sync import SyncToAsync
from django.db import close_old_connections

class db_sync_to_async(SyncToAsync):
    """
    Inspired by Django Channels
    (https://github.com/django/channels/blob/main/channels/db.py)
    """

    def thread_handler(self, loop, *args, **kwargs):
        close_old_connections()
        try:
            return super().thread_handler(loop, *args, **kwargs)
        finally:
            close_old_connections()