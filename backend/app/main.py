from contextlib import asynccontextmanager
import uvicorn
from starlette.status import HTTP_401_UNAUTHORIZED
from db import PostgresDatabase
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.base import BaseHTTPMiddleware
from auth.permissions import check_permission
from auth.routes import auth_router, user_router
from core.routes import router as core_router
from settings import Settings
from auth.routes.init_script import init_router
from db import AsyncClickHouseConnection, RedisDatabase


@asynccontextmanager
async def lifespan(app: FastAPI):
    # initialize settings
    settings = Settings()
    app.state.settings = settings
    print(settings.__dict__)

    database = PostgresDatabase(settings=settings)
    await database.connect()

    app.state.postgres_db = database

    # app.state.clickhouse_db = AsyncClickHouseConnection(
    #     settings.clickhouse_host,
    #     settings.clickhouse_port,
    #     settings.clickhouse_user,
    #     settings.clickhouse_password,
    #     settings.clickhouse_db,
    # )

    # app.state.rcluster_client = RedisDatabase(settings=settings)

    await database.create_tables()

    print("Loading Completed !")
    yield

    print(
        "================================ Shutting down ================================================="
    )


app = FastAPI(title="search-api", docs_url="/docs", redoc_url=None, lifespan=lifespan)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/retailstudio/app/token")


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title, version=app.version, routes=app.routes
    )
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2Password": {
            "type": "oauth2",
            "flows": {
                "password": {"tokenUrl": "/retailstudio/app/token", "scopes": {}}
            },
        }
    }
    openapi_schema["security"] = [{"OAuth2Password": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


class AuthenticationMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        db = request.app.state.postgres_db.database
        settings = request.app.state.settings

        print(f"Authentication Enabled: {settings.authentication_enabled}")

        if settings.authentication_enabled:
            auth = request.headers.get("Authorization")
            print("Checking permissions...")
            success, ret_obj = await check_permission(
                request.method, request.url.path, auth, db
            )
        else:
            success, ret_obj = True, {}

        # If authentication fails, respond with 401 Unauthorized
        if not success:
            return JSONResponse(
                {"detail": "Unauthorized access"}, status_code=HTTP_401_UNAUTHORIZED
            )
        else:
            request.state.user = ret_obj

        # Proceed with the request if authorized
        return await call_next(request)



app.add_middleware(AuthenticationMiddleware)
# ensure that all origins are allowed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {"Welcome": "To search console backend"}



app.include_router(auth_router)
app.include_router(user_router)
app.include_router(core_router)

app.include_router(init_router)


if __name__ == "__main__":
    settings = Settings()
    uvicorn.run(app, host="0.0.0.0", port=settings.app_port)
