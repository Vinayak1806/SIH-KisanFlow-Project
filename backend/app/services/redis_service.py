"""Redis service for queue management, caching, and fallback memory queue."""
import logging
from typing import List, Optional
import redis
from app.config.settings import settings

logger = logging.getLogger("kisanflow.redis")


class RedisQueueService:
    """Manages center queues using Redis Sorted Sets with in-memory fallback."""

    def __init__(self):
        self.client = None
        self._memory_queues = {}  # Fallback for development if Redis daemon is offline
        try:
            self.client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
            self.client.ping()
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            logger.warning(f"Redis not accessible ({e}). Running in-memory queue fallback for prototype.")
            self.client = None

    def _queue_key(self, center_id: int) -> str:
        return f"queue:center:{center_id}"

    def push_token(self, center_id: int, token_id: str, priority_score: float) -> int:
        """Add a token to center queue sorted by score (timestamp or queue position)."""
        key = self._queue_key(center_id)
        if self.client:
            try:
                self.client.zadd(key, {token_id: priority_score})
                rank = self.client.zrank(key, token_id)
                return (rank + 1) if rank is not None else 1
            except Exception as e:
                logger.error(f"Redis zadd failed: {e}")

        # In-memory fallback
        if key not in self._memory_queues:
            self._memory_queues[key] = []
        
        # Remove if exists
        self._memory_queues[key] = [item for item in self._memory_queues[key] if item[0] != token_id]
        self._memory_queues[key].append((token_id, priority_score))
        self._memory_queues[key].sort(key=lambda x: x[1])
        return next(i + 1 for i, item in enumerate(self._memory_queues[key]) if item[0] == token_id)

    def get_queue_position(self, center_id: int, token_id: str) -> Optional[int]:
        """Get 1-based queue position."""
        key = self._queue_key(center_id)
        if self.client:
            try:
                rank = self.client.zrank(key, token_id)
                if rank is not None:
                    return rank + 1
            except Exception as e:
                logger.error(f"Redis zrank failed: {e}")

        if key in self._memory_queues:
            for i, (tid, _) in enumerate(self._memory_queues[key]):
                if tid == token_id:
                    return i + 1
        return None

    def remove_token(self, center_id: int, token_id: str) -> bool:
        """Remove token from queue when completed, cancelled or no-show."""
        key = self._queue_key(center_id)
        if self.client:
            try:
                self.client.zrem(key, token_id)
            except Exception as e:
                logger.error(f"Redis zrem failed: {e}")

        if key in self._memory_queues:
            self._memory_queues[key] = [item for item in self._memory_queues[key] if item[0] != token_id]
        return True

    def get_all_queued_tokens(self, center_id: int) -> List[str]:
        """Get all token IDs currently in the queue in order."""
        key = self._queue_key(center_id)
        if self.client:
            try:
                return self.client.zrange(key, 0, -1)
            except Exception as e:
                logger.error(f"Redis zrange failed: {e}")

        if key in self._memory_queues:
            return [item[0] for item in self._memory_queues[key]]
        return []

    def get_queue_length(self, center_id: int) -> int:
        """Get total number of tokens in queue."""
        key = self._queue_key(center_id)
        if self.client:
            try:
                return self.client.zcard(key) or 0
            except Exception as e:
                logger.error(f"Redis zcard failed: {e}")

        return len(self._memory_queues.get(key, []))


redis_service = RedisQueueService()
