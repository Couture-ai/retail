from typing import List
from fastapi import APIRouter, Depends, Form, Request

from auth.schema import Token, UserRole, User
from sqlalchemy import asc, desc, insert, select, func, update

from sqlalchemy.inspection import inspect as insp
import json
import hashlib
from utils.commons import get_postgres_db


init_router = APIRouter(prefix="/retailstudio", tags=["retailstudio-init"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# create usecase
@init_router.post("/init", operation_id="add-usecase")
async def init_script(
    postgres_db=Depends(get_postgres_db),
):
    users = [
        {"name": "retailops-user", "roles": ["retailops-user"], "password": "@321retailops"},
        {
            "name": "retailops-admin",
            "roles": ["retailops-admin", "retailops-user", "retailops-editor"],
            "password": "@321retailops_admin",
        },
        {
            "name": "retailops-editor",
            "roles": ["retailops-editor", "retailops-user"],
            "password": "@321retailops_editor",
        }
      
    ]
    for user in users:
        query = select(User).where(User.username == user["name"])
        result = await postgres_db.fetch_all(query)
        if len(result) > 0:
            continue
        hashed_password = hash_password(user["password"])
        stmt = insert(User).values(
            username=user["name"], password=hashed_password, roles=user["roles"]
        )
        await postgres_db.execute(stmt)

