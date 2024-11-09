from datetime import datetime
from typing import Any

from beanie import PydanticObjectId
from pymongo import IndexModel

from src.pydantic_base import BaseSchema
from src.storages.mongo.__base__ import CustomDocument


class AnswerSchema(BaseSchema):
    """
    Schema defining an answer of the current user.
    """

    invite_id: PydanticObjectId
    "Invite id of the link by which user has been connected to the service"
    session_id: str
    "Session id that is connected to the current respondent"
    form_id: PydanticObjectId
    "Form entity containing information about the form of the respondent"
    answers: dict[int, Any]
    "Map of the answers for the current user"
    updated_at: datetime
    "Contains information about last changes in the given form from answer perspective"


class Answer(AnswerSchema, CustomDocument):
    class Settings:
        indexes = [IndexModel(("invite_id", "form_id", "session_id"), unique=True)]
