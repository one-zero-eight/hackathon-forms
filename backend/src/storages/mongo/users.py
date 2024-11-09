__all__ = ["User", "UserRole"]

from enum import StrEnum

from pymongo import IndexModel

from src.pydantic_base import BaseSchema
from src.storages.mongo.__base__ import CustomDocument


class UserRole(StrEnum):
    HR = "hr"
    MANAGER = "manager"
    ADMIN = "admin"


class UserSchema(BaseSchema):
    name: str | None = None
    email: str
    role: UserRole


class User(UserSchema, CustomDocument):
    class Settings:
        indexes = [IndexModel("email", unique=True)]
