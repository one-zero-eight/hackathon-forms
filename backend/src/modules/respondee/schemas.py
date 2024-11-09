from typing import Any

from beanie import PydanticObjectId

from src.pydantic_base import BaseSchema


class UpsertAnswerReq(BaseSchema):
    answers: dict[int, Any]


class ListAnswersFilter(BaseSchema):
    invite_id: PydanticObjectId
    session_id: str
