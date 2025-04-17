from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
    JSON,
    Integer,
    func,
    ForeignKey,
    Boolean,
    ARRAY,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Token(Base):
    __tablename__ = "retailstudio_token"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)  # email

    roles = Column(ARRAY(String), nullable=False)
    expires_in = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)

    token = Column(String, nullable=False)


class UserRole(Base):
    __tablename__ = "retailstudio_userrole"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)

    resources = Column(JSON, nullable=True)


class User(Base):
    __tablename__ = "retailstudio_user"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, nullable=True)
    roles = Column(ARRAY(String), nullable=True)


class AppToken(Base):
    __tablename__ = "retailstudio_apptoken"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)

    roles = Column(ARRAY(String), nullable=False)
    expires_in = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)

    token = Column(String, nullable=False)

# class Log(Base):
#     __tablename__ = "retailstudio_log"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     timestamp = Column(DateTime, nullable = False)
    
#     username = Column(String, nullable=True) # null means anonymous
#     ip = Column(String, nullable=True) # null means missing ip
#     session_id = Column(String, nullable = True)
    
#     url = Column(String, nullable = True)
#     method = Column(String, nullable = True)
#     status_code = Column(String, nullable = True)
    
#     activity_type = Column(String, nullable = True)
#     activity = Column(String, nullable = True)
#     data = Column(JSON, nullable = True)


