from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_port: str
    postgres_service: str
    uvicorn_workers: str

    redis_db: int = 0
    redis_host: str
    redis_port: int

    redis_username: str
    redis_password: str

    clickhouse_host: str
    clickhouse_port: str
    clickhouse_user: str
    clickhouse_password: str
    clickhouse_db: str

    authentication_enabled: bool = True


    class Config:
        env_file = ".env"
