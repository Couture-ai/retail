import base64
from auth.schema import Token, AppToken
from sqlalchemy import insert, select, delete
from datetime import datetime, timedelta


async def check_permission(method, api, auth, postgres_db):
    print("checking permission")
    # The following paths are always allowed:
    if method == "GET" and api[1:] in ["docs", "openapi.json", "favicon.ico"]:
        return True, {}
    print(api)
    if api.split("/")[-1] in ["login", "register", "token", "init"]:
        return True, {}
    # Parse auth header and check scheme, username and password
    print(auth)
    try:
        scheme, token = (auth or " ").split(" ", 1)

        if scheme != "Bearer":
            return False, "Scheme should be 'Bearer'"
    except Exception as e:
        return False, "Error in decoding token"
    q = select(AppToken).where(AppToken.token == token)
    res = await postgres_db.fetch_all(q)
    # token_query = select(Token).where(Token.token == token)
    # db_token = await postgres_db.fetch_all(token_query)

    # # Check if token exists
    if len(res) == 0:
        return False, "Authentication uncussessful. No token found."
    db_token = res[0]
    # Check if token is expired
    # current_time = datetime.utcnow()
    # current_epoch = int(current_time.timestamp())
    # expiration_epoch = int(db_token.created_at.timestamp()) + db_token.expires_in
    # remaining_seconds = expiration_epoch - current_epoch
    # if current_epoch > expiration_epoch:
    #     # Token has expired, delete it
    #     delete_query = delete(Token).where(Token.id == db_token.id)
    #     postgres_db.execute(delete_query)
    #     postgres_db.commit()
    #     return False, "Token has expired"
    if db_token.created_at + timedelta(seconds=db_token.expires_in) < datetime.utcnow():
        return False, "Token has expired"

    return True, {
        "valid": True,
        "username": db_token.username,
        "roles": db_token.roles,
        "expires_in": db_token.expires_in
        - int((datetime.utcnow() - db_token.created_at).total_seconds()),
    }
