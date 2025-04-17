import redis


class RedisDatabase:
    def __init__(self, settings):
        self.redis_db = redis.RedisCluster(
            host=settings.redis_host,
            port=settings.redis_port,
            username=settings.redis_username if settings.redis_username else  None,
            password=settings.redis_password if settings.redis_username else None,
        )
    # def __init__(self, settings):
    #     self.redis_db = redis.RedisCluster(
    #         host="10.166.181.219",
    #         port=8504,
    #         username=None,
    #         password=None,
    #     )
    def get_redis_db(self):
        return self.redis_db
