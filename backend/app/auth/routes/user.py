from fastapi import APIRouter, Depends, HTTPException, Form, Request
from sqlalchemy import insert, select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
import jwt
import hashlib
from datetime import datetime, timedelta
from auth.schema import User, AppToken, UserRole
from utils.commons import get_postgres_db
import base64
import json
import hmac

# Constants for JWT
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

# Initialize the router
user_router = APIRouter(prefix="/retailstudio", tags=["retailstudio-user"])


def base64url_encode(data):
    """Encodes data in URL-safe Base64 format without padding."""
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def create_jwt(payload, secret, algorithm="HS256"):
    """Manually creates a JWT token without using create_jwt."""
    # Define header
    header = {"alg": algorithm, "typ": "JWT"}

    # Encode header & payload
    header_encoded = base64url_encode(json.dumps(header).encode())
    payload_encoded = base64url_encode(json.dumps(payload).encode())

    # Create signing input
    signing_input = f"{header_encoded}.{payload_encoded}"

    # Choose hashing algorithm
    if algorithm == "HS256":
        hash_function = hashlib.sha256
    elif algorithm == "HS384":
        hash_function = hashlib.sha384
    elif algorithm == "HS512":
        hash_function = hashlib.sha512
    else:
        raise ValueError("Unsupported algorithm")

    # Sign the token
    signature = hmac.new(
        secret.encode(), signing_input.encode(), hash_function
    ).digest()
    signature_encoded = base64url_encode(signature)

    # Return the complete JWT token
    return f"{signing_input}.{signature_encoded}"


# Helper function to hash passwords
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@user_router.post("/app/register", operation_id="app-register")
async def app_register(
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(None),
    postgres_db: AsyncSession = Depends(get_postgres_db),
):
    # Check if user already exists
    query = select(User).where(User.username == username)
    result = await postgres_db.fetch_all(query)
    if result:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password
    hashed_password = hash_password(password)

    # Create new user
    stmt = insert(User).values(username=username, password=hashed_password, email=email)
    await postgres_db.execute(stmt)

    return {"message": "User registered successfully"}


@user_router.post("/app/login", operation_id="app-login")
async def app_login(
    username: str = Form(...),
    password: str = Form(...),
    postgres_db: AsyncSession = Depends(get_postgres_db),
):
    # Fetch user by username
    print("reached")
    query = select(User).where(User.username == username)
    result = await postgres_db.fetch_all(query)
    
    # Check if result is empty before trying to access it
    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    print(result[0].__dict__)
    if hash_password(password) != result[0].password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user = result[0]
    print(user)

    token_query = select(AppToken).where(AppToken.username == user.username)
    token_result = await postgres_db.fetch_all(token_query)
    
    # Check if user has roles attribute and if it exists
    roles = user.get("roles", []) if hasattr(user, "get") else getattr(user, "roles", [])
    if roles is None:
        roles = []
        
    # Handle resources query based on roles
    try:
        if "searchops" in roles:
            q = select(UserRole)
            resources_result = await postgres_db.fetch_all(q)
        else:
            q = select(UserRole).where(UserRole.name.in_(roles))
            resources_result = await postgres_db.fetch_all(q)
            
        resources = []
        for re in resources_result:
            if hasattr(re, "resources"):
                resources.append(re.resources)
            elif hasattr(re, "__getitem__"):
                resources.append(re["resources"])
    except Exception as e:
        print(f"Error fetching resources: {str(e)}")
        resources = []
        
    print(resources)
    
    # Check if token exists and is still valid
    if (
        token_result
        and token_result[0].created_at + timedelta(seconds=token_result[0].expires_in)
        > datetime.utcnow()
    ):
        # Get user roles safely
        user_roles = roles
        
        return {
            "access_token": token_result[0].token,
            "token_type": "bearer",
            "roles": user_roles,
            "resources": resources,
            # take the difference between the expiration time and the current time
            "expires_in": token_result[0].expires_in
            - int((datetime.utcnow() - token_result[0].created_at).total_seconds()),
        }

    # Generate JWT token
    expires_at = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {
        "sub": user.username,
        "exp": expires_at.isoformat(),
    }
    token = create_jwt(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Store the token in AppToken table
    stmt = insert(AppToken).values(
        username=user.username,
        roles=roles,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        created_at=datetime.utcnow(),
        token=token,
    )
    await postgres_db.execute(stmt)

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES,
        "roles": roles,
        "resources": resources,
    }


@user_router.post("/app/logout", operation_id="app-logout")
async def app_logout(
    request: Request,
    token: str = Form(...),
    postgres_db: AsyncSession = Depends(get_postgres_db),
):
    # Find and delete the token in the AppToken table
    query = select(AppToken).where(AppToken.token == token)
    result = await postgres_db.fetch_all(query)
    if not result:
        raise HTTPException(status_code=404, detail="Token not found")

    stmt = delete(AppToken).where(AppToken.token == token)
    await postgres_db.execute(stmt)

    return {"message": "Logged out successfully"}


@user_router.post("/app/users", operation_id="create-user")
async def create_user(
    username: str = Form(...),
    password: str = Form(...),
    roles: List[str] = Form([]),
    email: str = Form(None),
    postgres_db: AsyncSession = Depends(get_postgres_db),
):
    # Same as app_register endpoint logic
    query = select(User).where(User.username == username)
    result = await postgres_db.fetch_all(query)
    if result:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = hash_password(password)

    stmt = insert(User).values(
        username=username, password=hashed_password, email=email, roles=roles
    )
    await postgres_db.execute(stmt)

    return {"message": "User created successfully"}


@user_router.get("/app/users", operation_id="get-users")
async def get_users(
    postgres_db: AsyncSession = Depends(get_postgres_db),
):
    # Fetch all users
    query = select(User)
    result = await postgres_db.fetch_all(query)
    return result


@user_router.post("/app/token", operation_id="app-token")
async def app_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    postgres_db: AsyncSession = Depends(get_postgres_db),
):
    # Fetch user by username
    print("reached")
    query = select(User).where(User.username == form_data.username)
    result = await postgres_db.fetch_all(query)
    
    # Check if result is empty before trying to access it
    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    print(result[0].__dict__)
    if hash_password(form_data.password) != result[0].password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user = result[0]
    print(user)

    token_query = select(AppToken).where(AppToken.username == user.username)
    token_result = await postgres_db.fetch_all(token_query)
    
    # Check if user has roles attribute and if it exists
    roles = user.get("roles", []) if hasattr(user, "get") else getattr(user, "roles", [])
    if roles is None:
        roles = []
        
    # Handle resources query based on roles
    try:
        if "searchops" in roles:
            q = select(UserRole)
            resources_result = await postgres_db.fetch_all(q)
        else:
            q = select(UserRole).where(UserRole.name.in_(roles))
            resources_result = await postgres_db.fetch_all(q)
            
        resources = []
        for re in resources_result:
            if hasattr(re, "resources"):
                resources.append(re.resources)
            elif hasattr(re, "__getitem__"):
                resources.append(re["resources"])
    except Exception as e:
        print(f"Error fetching resources: {str(e)}")
        resources = []
        
    print(resources)
    
    # Check if token exists and is still valid
    if (
        token_result
        and token_result[0].created_at + timedelta(seconds=token_result[0].expires_in)
        > datetime.utcnow()
    ):
        return {
            "access_token": token_result[0].token,
            "token_type": "bearer",
            "roles": roles,
            "resources": resources,
            # take the difference between the expiration time and the current time
            "expires_in": token_result[0].expires_in
            - int((datetime.utcnow() - token_result[0].created_at).total_seconds()),
        }

    # Generate JWT token
    expires_at = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {
        "sub": user.username,
        "exp": expires_at.isoformat(),
    }
    token = create_jwt(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Store the token in AppToken table
    stmt = insert(AppToken).values(
        username=user.username,
        roles=roles,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        created_at=datetime.utcnow(),
        token=token,
    )
    await postgres_db.execute(stmt)

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES,
        "roles": roles,
        "resources": resources,
    }
