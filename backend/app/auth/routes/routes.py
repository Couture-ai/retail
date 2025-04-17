from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, Request
import pandas as pd
from sqlalchemy import insert, select, delete, update
from utils.commons import get_postgres_db
from auth.schema import Token, UserRole
import json
import requests
import logging
from datetime import datetime
import base64


auth_router = APIRouter(prefix="/retailstudio", tags=["retailstudio-auth"])


logger = logging.getLogger(__name__)


class TokenError(Exception):
    def __init__(
        self, message: str, status_code: int, error_details: Optional[Dict] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_details = error_details
        super().__init__(message)


def decode_jwt(token):
    try:
        # Split the token into header, payload, and signature
        header, payload, signature = token.split(".")

        # Decode the header and payload
        header_decoded = base64.urlsafe_b64decode(f"{header}==").decode("utf-8")
        payload_decoded = base64.urlsafe_b64decode(f"{payload}==").decode("utf-8")

        # Parse the JSON strings into dictionaries
        header_json = json.loads(header_decoded)
        payload_json = json.loads(payload_decoded)

        return payload_json
    except Exception as e:
        raise ValueError(f"Invalid JWT format: {e}")


@auth_router.post("/login", operation_id="fetch-token")
async def fetch_token(
    client_id: str = Form(...),
    client_secret: str = Form(...),
    code: str = Form(...),
    redirect_uri: str = Form(...),
    token_url: str = Form(...),
    psotgres_db=Depends(get_postgres_db),
):
    """
    Exchange authorization code for access token from Authentik server
    """
    try:
        # Log the request (excluding sensitive data)
        logger.info(f"Initiating token request to {token_url}")
        logger.debug(f"Using redirect URI: {redirect_uri}")

        # Prepare the token request payload
        token_request_data = {
            "grant_type": "authorization_code",
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "redirect_uri": redirect_uri,
        }

        # Make request to token endpoint
        response = requests.post(
            token_url,
            data=token_request_data,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            timeout=10,  # Add timeout
        )

        # Detailed error handling
        if response.status_code != 200:
            error_details = {}
            try:
                error_data = response.json()
                error_details = {
                    "error": error_data.get("error"),
                    "error_description": error_data.get("error_description"),
                    "status_code": response.status_code,
                }

                # Map common OAuth2 errors to user-friendly messages
                error_messages = {
                    "invalid_request": "The request is missing a required parameter or is malformed",
                    "invalid_client": "Client authentication failed",
                    "invalid_grant": "The authorization code is invalid or expired",
                    "unauthorized_client": "The client is not authorized to use this grant type",
                    "unsupported_grant_type": "The authorization grant type is not supported",
                    "invalid_scope": "The requested scope is invalid or unknown",
                }

                error_type = error_data.get("error")
                error_message = error_messages.get(
                    error_type,
                    error_data.get("error_description", "Unknown error occurred"),
                )

                logger.error(
                    f"Token request failed: {error_message}", extra=error_details
                )

                raise TokenError(
                    message=error_message,
                    status_code=response.status_code,
                    error_details=error_details,
                )

            except ValueError:
                # Response wasn't JSON
                error_message = f"Invalid response from auth server: {response.text}"
                logger.error(error_message)
                raise TokenError(
                    message=error_message, status_code=response.status_code
                )

        # Process successful response
        token_data = response.json()
        access_token = token_data.get("access_token")
        decoded_token = decode_jwt(access_token)
        logger.info("Successfully obtained token")
        roles = decoded_token["groups"]

        if "searchops-admin" in roles:
            q = select(UserRole)
            resources = await psotgres_db.fetch_all(q)
        else:
            q = select(UserRole).where(UserRole.name.in_(roles))
            resources = await psotgres_db.fetch_all(q)
        resources = [re["resources"] for re in resources]
        print(resources)

        response = {
            "access_token": token_data.get("access_token"),
            "token_type": token_data.get("token_type", "Bearer"),
            "expires_in": token_data.get("expires_in"),
            "refresh_token": token_data.get("refresh_token"),
            "scope": token_data.get("scope", ""),
            "decoded_token": decoded_token,
            "resources": resources,
        }
        try:
            delete_query = delete(Token).where(Token.username == decoded_token["email"])
            await psotgres_db.execute(delete_query)
            query = insert(Token).values(
                username=decoded_token["email"],
                roles=decoded_token["groups"],
                expires_in=int(token_data["expires_in"]),
                created_at=datetime.utcnow(),
                token=token_data.get("access_token"),
            )
            await psotgres_db.execute(query)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=400,
                detail={"message": "Unable to save", "details": str(e)},
            )

        print(response)
        return response

    except requests.RequestException as e:
        error_message = f"Connection error while fetching token: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=503, detail=error_message)

    except TokenError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail={"message": e.message, "details": e.error_details},
        )

    except Exception as e:
        error_message = f"Unexpected error in token fetch: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)


@auth_router.post("/verify-token", operation_id="verify-token")
async def verify_token(token: str = Form(...), postgres_db=Depends(get_postgres_db)):
    """
    Verify if the token exists in database and is still valid
    """
    try:
        # Query the token from database

        token_query = select(Token).where(Token.token == token)
        db_token = await postgres_db.fetch_all(token_query)

        # Check if token exists
        if len(db_token) == 0:
            raise HTTPException(status_code=401, detail="Token not found in database")
        db_token = db_token[0]
        # Check if token is expired
        current_time = datetime.utcnow()
        current_epoch = int(current_time.timestamp())
        expiration_epoch = int(db_token.created_at.timestamp()) + db_token.expires_in
        remaining_seconds = expiration_epoch - current_epoch
        if current_epoch > expiration_epoch:
            # Token has expired, delete it
            delete_query = delete(Token).where(Token.id == db_token.id)
            postgres_db.execute(delete_query)
            postgres_db.commit()

            raise HTTPException(status_code=401, detail="Token has expired")

        # Token is valid, return user information
        return {
            "valid": True,
            "username": db_token.username,
            "roles": db_token.roles,
            "expires_in": remaining_seconds,
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Error verifying token: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error verifying token: {str(e)}")


@auth_router.post("/logout", operation_id="logout-user")
async def logout_user(
    id_token: str = Form(...),
    logout_url: str = Form(...),
    psotgres_db=Depends(get_postgres_db),
):
    """
    Logs out the user from the OIDC provider and removes their token from the database.
    """
    try:
        # Log the request
        logger.info(f"Initiating logout request to {logout_url}")

        # Prepare the logout URL with the ID token hint
        params = {
            "id_token_hint": id_token,
            "post_logout_redirect_uri": logout_url,
        }
        response = requests.get(
            logout_url,
            params=params,
            headers={"Accept": "application/json"},
            timeout=10,  # Add timeout
        )

        # Detailed error handling
        if response.status_code != 200:
            error_message = f"OIDC logout failed: {response.text}"
            logger.error(error_message)
            raise HTTPException(
                status_code=response.status_code,
                detail={"message": error_message},
            )

        # If successful, remove the token from the database
        try:
            query = delete(Token).where(Token.token == id_token)
            await psotgres_db.execute(query)
            logger.info("Token successfully removed from the database")
        except Exception as e:
            error_message = f"Failed to remove token from database: {str(e)}"
            logger.error(error_message)
            raise HTTPException(
                status_code=500,
                detail={"message": error_message, "details": str(e)},
            )

        return {"message": "User successfully logged out"}

    except requests.RequestException as e:
        error_message = f"Connection error while logging out: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=503, detail=error_message)

    except Exception as e:
        error_message = f"Unexpected error during logout: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)


@auth_router.post("/resources", operation_id="add_resource")
async def add_resource(
    request: Request,
    name: str = Form(...),
    resources: str = Form(...),
    postgres_db=Depends(get_postgres_db),
):
    user = request.state.user

    print(user)
    print(json.loads(resources))
    q = select(UserRole).where(UserRole.name == name)
    res = await postgres_db.fetch_all(q)
    try:
        if len(res) == 0:
            q = insert(UserRole).values(name=name, resources=json.loads(resources))
            await postgres_db.execute(q)
        else:
            q = (
                update(UserRole)
                .where(UserRole.name == name)
                .values(resources=json.loads(resources))
            )
            await postgres_db.execute(q)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail={"message": "Unable to save", "details": str(e)},
        )
    q = select(UserRole).where(UserRole.name == name)
    res = await postgres_db.fetch_one(q)
    return res


@auth_router.get("/resources", operation_id="add_resource")
async def add_resource(
    request: Request,
    postgres_db=Depends(get_postgres_db),
):
    pass
    user = request.state.user
    roles = user["roles"]
    if "searchops-admin" in roles:
        q = select(UserRole)
        res = await postgres_db.fetch_all(q)
        return res
    q = select(UserRole).where(UserRole.name.in_(roles))
    return await postgres_db.fetch_all(q)

