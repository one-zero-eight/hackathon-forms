from src.pydantic_base import BaseSchema
from src.storages.mongo.forms import FormNode


class CreateFormReq(BaseSchema):
    title: str
    description: str | None = None
    nodes: list[FormNode]
    created_by: str
