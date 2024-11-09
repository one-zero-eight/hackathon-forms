from src.pydantic_base import BaseSchema
from src.storages.mongo.forms import FormNode, FormSchema


class CreateFormReq(BaseSchema):
    title: str
    description: str | None = None
    nodes: list[FormNode] = []


class CreateInviteReq(BaseSchema):
    one_time: bool = False


class UpdateFormReq(FormSchema):
    """
    Schema defining a form, which contains metadata and a series of nodes (questions).
    """

    title: str | None = None
    "Title of the form."
    description: str | None = None
    "Optional description providing additional context for the form."
    nodes: list[FormNode] | None = None
    "List of nodes, each representing a question with content, options, and configurations."
