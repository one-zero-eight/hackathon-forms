__all__ = ["CreateUser"]

from datetime import datetime
from src.pydantic_base import BaseSchema


class Form(BaseSchema):
    form_uuid: str
    description: str
    root_node: str | None = None
    created_at: datetime | None = 
    created_by: str
    updated_at: datetime
    updated_by: str
    deleted_at: datetime
    deleted_by: datetime
