from threading import Lock, main_thread
from typing import Callable, Any

from asgiref.sync import AsyncToSync, sync_to_async
from django.db import close_old_connections

class db_sync_to_async:
    executor = None
    lock = Lock()

    def __init__(self, func: Callable[..., Any]):
        self.func = func

    def __call__(self,  *args, **kwargs):
        # asgiref.sync.sync_to_async is supposed to stick everything on the same
        # executor when thread_sensitive=True, but it fails to find the root thread
        # inside a task https://github.com/django/asgiref/issues/214
        # Here we save a reference to the executor on the main thread if it exists,
        # or let sync_to_async do its magic and then save it if it doesn't.
        # Then, we can get the reference back whenever we end up being called from a
        # new task thread.
        # I know this is terrible
        t_main = main_thread()
        with self.lock:
            if self.executor is not None and self.executor._broken:
                self.executor = None
                if hasattr(t_main, "db_current_executor"):
                    if t_main.db_current_executor._broken:
                        delattr(t_main, "db_current_executor")
                    else:
                        self.executor = t_main.db_current_executor
            if self.executor is None:
                if hasattr(t_main, "db_current_executor"):
                    if not t_main.db_current_executor._broken:
                        self.executor = t_main.db_current_executor
                else:
                    # This will occur first time this decorator is called
                    res = sync_to_async(self.func)(*args, **kwargs)
                    self.executor = AsyncToSync.executors.current
                    setattr(t_main, "db_current_executor", self.executor)
                    return res

        return sync_to_async(
                self.func, thread_sensitive=False, executor=self.executor
            )(*args, **kwargs)

