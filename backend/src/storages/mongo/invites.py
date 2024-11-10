import datetime

from beanie import PydanticObjectId
from pymongo import IndexModel

from src.pydantic_base import BaseSchema
from src.storages.mongo.__base__ import CustomDocument


class InviteSchema(BaseSchema):
    key: str
    created_at: datetime.datetime
    created_by: PydanticObjectId
    form_id: PydanticObjectId
    "Form for which link is created"
    one_time: bool = False
    used_by: list[str] = []
    "List of session ids"
    active: bool = True
    "Is active"


class Invite(InviteSchema, CustomDocument):
    class Settings:
        indexes = [IndexModel("key", unique=True, partialFilterExpression={"active": True})]
