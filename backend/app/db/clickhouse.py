from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text, Column, Integer, String, Table, MetaData
from sqlalchemy.sql import select
from clickhouse_sqlalchemy import Table, engines
import asyncio


class AsyncClickHouseConnection:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password
        # self.logger = logger
        self.pool_size = 100
        self.max_overflow = 50
        self.connection_string = f"clickhouse+asynch://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"
        # self.logger.info(f"Connection string: {self.connection_string}")
        # Initialize the connection pool
        self.engine = create_async_engine(
            self.connection_string,
            pool_size=self.pool_size,
            max_overflow=self.max_overflow,
            pool_pre_ping=True,
        )
        # self.logger.info("Clickhouse engine initialized")
        # Create a sessionmaker
        self.async_session = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )
        # self.logger.info("Clickhouse session initialized")

    async def create_table(self, schemas):
        """
        Create tables in the ClickHouse database dynamically from SQLAlchemy schema objects.
        """
        # Loop through the schemas and create each table.
        for schema in schemas:
            # Use schema.__table__.create to create the table.
            await asyncio.to_thread(
                schema.__table__.create, bind=self.engine, checkfirst=True
            )

    async def fetch_data(self, schema):
        """Example async function to query data from a table using SQLAlchemy AsyncSession"""
        async with self.engine.connect() as conn:
            result = await conn.execute(select(schema))
            data = result.fetchall()
            return data

    @asynccontextmanager
    async def query_pool(self):
        async with self.async_session() as session:
            yield session

    async def fetch_all(self, query):
        # self.logger.info3("Executing clickhouse query")
        async with self.query_pool() as session:
            result = await session.execute(query)
            return result.fetchall()

    # update
    async def execute(self, query):
        # self.logger.info3("Executing clickhouse query")
        async with self.query_pool() as session:
            await session.execute(query)
            return True

    async def insert_query_logs(self, query_logs):
        try:
            async with self.query_pool() as session:
                session.add(query_logs)
                await session.commit()
                # self.logger.info3("Query logs inserted")
        except Exception as e:
            if "None" in str(e):
                pass
            else:
                pass
                # self.logger.error(f"Error while inserting query logs: {e}")

    async def create_temp_table(self, table_name, scores, batch_size=1000):
        metadata = MetaData()

        # Define the temporary table schema
        temp_table = Table(
            table_name,
            metadata,
            Column("point_id", String, primary_key=True),
            Column("score", Integer),
        )

        # Create the temporary table
        async with self.query_pool() as session:
            async with session.begin():
                # await session.run_sync(metadata.create_all)
                # query to create in memeory tablw
                query = query = f"""
                    CREATE TABLE IF NOT EXISTS {table_name} (
                        point_id VARCHAR(255),
                        score FLOAT
                    ) ENGINE = Memory
                    """
                await session.execute(text(query))

                # Prepare data for batch insertion
                try:
                    data_batches = []
                    for point_id, score in scores.items():
                        # Append data as a tuple instead of a dictionary
                        data_batches.append((point_id, score))

                        # Insert in batches
                        if len(data_batches) == batch_size:
                            await session.execute(
                                text(
                                    f"INSERT INTO {table_name} (point_id, score) VALUES (:1, :2)"
                                ),
                                data_batches,
                            )
                            data_batches = []  # Clear the batch after insertion

                    # Insert any remaining data that didn't fill a complete batch
                    if data_batches:
                        await session.execute(
                            text(
                                f"INSERT INTO {table_name} (point_id, score) VALUES (:1, :2)"
                            ),
                            data_batches,
                        )
                    # self.logger.info3(
                    #     f"Temporary table {table_name} created and data inserted"
                    # )
                except Exception as e:
                    # self.logger.error(
                    #     f"Error while inserting data into temporary table: {e}"
                    # )
                    await session.rollback()

        return temp_table

    async def drop_temp_table(self, table_name):
        async with self.query_pool() as session:
            async with session.begin():
                # Drop the temporary table if it exists
                await session.execute(text(f"DROP TABLE IF EXISTS {table_name}"))
                # self.logger.info3(f"Temporary table {table_name} dropped")
