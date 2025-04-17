import databases
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from auth.schema import Token, UserRole, User, AppToken
from schema import Forecast


class PostgresDatabase:
    def __init__(self, settings):
        SQLALCHEMY_DATABASE_URL = (
            "postgresql://"
            + settings.postgres_user
            + ":"
            + settings.postgres_password
            + "@"
            + settings.postgres_service
            + ":"
            + settings.postgres_port
            + "/"
            + settings.postgres_db
        )
        SQLALCHEMY_DATABASE_URL_ASYNC = (
            "postgresql+asyncpg://"
            + settings.postgres_user
            + ":"
            + settings.postgres_password
            + "@"
            + settings.postgres_service
            + ":"
            + settings.postgres_port
            + "/"
            + settings.postgres_db
        )

        self.postgres_engine = create_engine(SQLALCHEMY_DATABASE_URL)

        Session = sessionmaker(
            autocommit=False, autoflush=False, bind=self.postgres_engine
        )
        postgres_sync_db = Session()  # noqa: F841

        self.database = databases.Database(SQLALCHEMY_DATABASE_URL_ASYNC)

    async def connect(self):
        await self.database.connect()

    def get_postgres_db(self):
        return self.database

    async def create_tables(self):
        Token.__table__.create(bind=self.postgres_engine, checkfirst=True)
        UserRole.__table__.create(bind=self.postgres_engine, checkfirst=True)
        User.__table__.create(bind=self.postgres_engine, checkfirst=True)
        AppToken.__table__.create(bind=self.postgres_engine, checkfirst=True)
        Forecast.__table__.create(bind=self.postgres_engine, checkfirst=True)

        print("Postgres table created")
