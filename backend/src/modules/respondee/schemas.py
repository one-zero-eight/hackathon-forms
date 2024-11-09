from typing import Any

from beanie import PydanticObjectId

from src.pydantic_base import BaseSchema


class UpsertAnswerReq(BaseSchema):
    answers: dict[int, Any]


class ListAnswersFilter(BaseSchema):
    invite_id: PydanticObjectId | None = None
    session_id: str | None = None
