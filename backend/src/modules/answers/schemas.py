from typing import Any

from beanie import PydanticObjectId

from src.pydantic_base import BaseSchema


class UpsertAnswerReq(BaseSchema):
    invite_id: PydanticObjectId
    session_id: str
    form_id: PydanticObjectId
    answers: dict[int, Any]
