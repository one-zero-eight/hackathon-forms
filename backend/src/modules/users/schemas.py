__all__ = ["CreateUser"]

from src.pydantic_base import BaseSchema


class CreateUser(BaseSchema):
    email: str
    name: str | None = None
