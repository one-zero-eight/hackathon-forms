from typing import Any

from src.pydantic_base import BaseSchema


class UpsertAnswerReq(BaseSchema):
    answers: dict[int, Any]
