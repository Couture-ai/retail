import redis
from settings import settings

redis_db = redis.RedisCluster(
    host=settings.redis_host,
    port=settings.redis_port,
    db=settings.redis_db,
    decode_responses=True,
    username=settings.redis_username,
    password=settings.redis_password,
)
