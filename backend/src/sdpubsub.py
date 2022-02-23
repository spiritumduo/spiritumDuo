import asyncio
import dataclasses
import logging
from contextlib import asynccontextmanager
from typing import Any, Dict, AsyncIterator, Optional, AsyncGenerator, List, Set


class Unsubscribed(Exception):
    pass


class Subscriber:
    def __init__(self, queue: asyncio.Queue) -> None:
        self._queue = queue

    async def __aiter__(self) -> Optional[AsyncGenerator]:
        try:
            while True:
                yield await self.get()
        except Unsubscribed:
            pass

    async def get(self):
        item = await self._queue.get()
        if item is None:
            raise Unsubscribed()
        return item


@dataclasses.dataclass
class SdPubSubEvent:
    topic: str
    message: Any


class SdPubSub:
    def __init__(self):
        self._topics: Dict[str, Set[asyncio.Queue[Any]]] = {}
        self._publish_queue: asyncio.Queue[SdPubSubEvent] = asyncio.Queue()
        self._publish_listener_task = None

    async def _publish_listener(self) -> None:
        while True:
            event: SdPubSubEvent = await self._publish_queue.get()
            if event.topic in self._topics.keys():
                queue_coroutines = []
                for queue in self._topics[event.topic]:
                    await queue.put(event.message)

    async def publish(self, topic: str, message: Any):
        await self._publish_queue.put(SdPubSubEvent(topic=topic, message=message))

    @asynccontextmanager
    async def subscribe(self, topic: str) -> AsyncIterator["Subscriber"]:
        queue: asyncio.Queue = asyncio.Queue()
        try:
            logging.info(f'subscribed to {topic}')
            self._publish_listener_task = asyncio.create_task(self._publish_listener())

            if not self._topics.get(topic):
                self._topics[topic] = {queue}
            else:
                self._topics[topic].add(queue)

            yield Subscriber(queue)

            self._topics[topic].remove(queue)
            if not self._topics.get(topic):
                del self._topics[topic]
        finally:
            await queue.put(None)
            if self._publish_listener_task.done():
                self._publish_listener_task.result()
            else:
                self._publish_listener_task.cancel()
