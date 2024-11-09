from datetime import datetime
from typing import Literal, Union

from beanie import PydanticObjectId
from pydantic import Field

from src.pydantic_base import BaseSchema
from src.storages.mongo.__base__ import CustomDocument


class Explanation(BaseSchema):
    explanation: str
    for_correct_answer_too: bool = False
    "Show not only on incorrect but on correct answer too"


class Content(BaseSchema):
    """
    Content model that holds the title, markdown content, and media URLs for a form question.
    """

    title: str | None = None
    "The title of the content section for the form node."
    md_content: str | None = None
    "Markdown formatted content providing additional information or instructions."
    medias: list[str] = []
    "List of URLs pointing to media (e.g., images, videos) associated with the content."


class SingleChoice(BaseSchema):
    """
    Model for a single-choice question in a form.
    """

    question_type: Literal["select"]
    "Indicates the type of question as 'select' for single-choice."
    options: list[str]
    "List of answer options to choose from."
    correct_answer: int | None = None
    "Index of the correct answer option (optional)."
    explanation: Explanation


class MultipleChoice(BaseSchema):
    """
    Model for a multiple-choice question in a form.
    """

    question_type: Literal["multiple_choice"]
    "Indicates the type of question as 'multiple_choice'."
    options: list[str]
    "List of answer options, allowing multiple selections."
    correct_answer: list[int] | None = None
    "List of indices for the correct answers (optional)."
    explanation: Explanation


class Scale(BaseSchema):
    """
    Model for a scale-type question, allowing answers to be chosen from a specified scale.
    """

    question_type: Literal["scale"]
    "Indicates the type of question as 'scale'."
    scale: list[str]
    "List of scale labels, for example: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent']."
    correct_answer: list[int] | None = None
    "List of indices representing correct answers on the scale (optional)."
    explanation: Explanation


class Input(BaseSchema):
    """
    Model for an input-based question where respondents enter text.
    """

    question_type: Literal["input"]
    "Indicates the type of question as 'input'."
    textarea: bool = False
    "Determines whether the input is a single-line field (False) or a textarea (True)."
    correct_answer: list[str] | None = None
    "List of acceptable correct answers as text (optional)."
    explanation: Explanation


class Ranking(BaseSchema):
    """
    Model for a ranking-type question, where options are ranked in a specified order.
    """

    question_type: Literal["ranking"]
    "Indicates the type of question as 'ranking'."
    options: list[str]
    "List of options that must be ranked."
    correct_answer: list[int] | None = None
    "Correct order as a list of indices representing the ranking (optional)."
    explanation: Explanation


class Matching(BaseSchema):
    """
    Model for a matching-type question, where pairs are matched between two sets of options.
    """

    question_type: Literal["matching"]
    "Indicates the type of question as 'matching'."
    options_first: list[str]
    "List of items in the first group to be matched."
    options_second: list[str]
    "List of items in the second group to be matched."
    correct_answer: dict[int, int] | None = None
    """Dictionary where keys are indices of items in 'options_first' and values are indices of matched items in "
        "'options_second' (optional)."""
    explanation: Explanation


class FormNode(BaseSchema):
    """
    Represents a single node in a form, containing content and a question.
    """

    id: int
    "Index in Form.nodes"
    content: Content
    "Content providing context, information, or instructions for the question."
    question: Union[SingleChoice, MultipleChoice, Scale, Input, Ranking, Matching] = Field(
        ..., discriminator="question_type"
    )
    "The question to be presented, determined by the 'question_type' field."
    required: bool
    "Determines if the question is mandatory (True) or optional (False)."
    next_node: int | None = None
    "Index of the next node in 'Form.nodes' to proceed to, starting from zero."


class FormSchema(BaseSchema):
    """
    Schema defining a form, which contains metadata and a series of nodes (questions).
    """

    title: str
    "Title of the form."
    description: str | None = None
    "Optional description providing additional context for the form."
    nodes: list[FormNode]
    "List of nodes, each representing a question with content, options, and configurations."
    created_at: datetime
    "Timestamp of when the form was created."
    created_by: PydanticObjectId
    "Identifier of the user or system that created the form."
    updated_at: datetime | None = None
    "Timestamp of the last update made to the form (optional)."
    updated_by: PydanticObjectId | None = None
    "Identifier of the user who last updated the form (optional)."
    deleted_at: datetime | None = None
    "Timestamp of when the form was deleted (optional)."
    deleted_by: PydanticObjectId | None = None
    "Identifier of the user who deleted the form (optional)."


class Form(FormSchema, CustomDocument):
    pass
