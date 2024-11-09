import datetime
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


class DateSelector(BaseSchema):
    question_type: Literal["date"]
    select_date: bool = True
    "Select date (one day)"
    select_time: bool = False
    "Select time (hour, minute)"
    correct_answer: datetime.date | datetime.datetime | None = None
    explanation: Explanation | None = None


class SingleChoice(BaseSchema):
    """
    Model for a single-choice question in a form.

    Notes:
        answer: int, with chosen index in self.options
    """

    question_type: Literal["select"]
    "Indicates the type of question as 'select' for single-choice."
    options: list[str]
    "List of answer options to choose from."
    correct_answer: int | None = None
    "Index of the correct answer option (optional)."
    explanation: Explanation | None = None


class MultipleChoice(BaseSchema):
    """
    Model for a multiple-choice question in a form.

    Notes:
        answer: list[int], with chosen indicies in self.options
    """

    question_type: Literal["multiple_choice"]
    "Indicates the type of question as 'multiple_choice'."
    options: list[str]
    "List of answer options, allowing multiple selections."
    correct_answer: list[int] | None = None
    "List of indices for the correct answers (optional)."
    explanation: Explanation | None = None


class Scale(BaseSchema):
    """
    Model for a scale-type question, allowing answers to be chosen from a specified scale.

    Notes:
        answer: int, with chosen index in self.scale
    """

    question_type: Literal["scale"]
    "Indicates the type of question as 'scale'."
    scale: list[str]
    "List of scale labels, for example: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent']."
    correct_answer: list[int] | None = None
    "List of indices representing correct answers on the scale (optional)."
    explanation: Explanation | None = None


class Contact(BaseSchema):
    """
    Contact-type question, allowing respondents to provide various contact details.

    Notes:
        answer: dict[str, str], with key (fullname, date_of_birth...) and user input as value.
         {"fullname": "Иванов Иван Иваныч", "gender": "M", ...}
    """

    question_type: Literal["contact"]
    fullname: bool = False
    "Indicating if the respondent's full name should be collected"
    date_of_birth: bool = False
    "Indicating if the respondent's date of birth should be collected"
    gender: bool = False
    "Indicating if the respondent's gender should be collected"
    phone: bool = False
    "Indicating if the respondent's phone number should be collected"
    email: bool = False
    "Indicating if the respondent's email should be collected"
    address: bool = False
    "Indicating if the respondent's address should be collected"
    telegram_alias: bool = False
    "Indicating if the respondent's Telegram alias should be collected"
    github: bool = False
    "Indicating if the respondent's GitHub profile should be collected"
    linkedin: bool = False
    "Indicating if the respondent's LinkedIn profile should be collected"
    portfolio: bool = False
    "Indicating if the respondent's portfolio link should be collected"
    website: bool = False
    "Indicating if the respondent's personal website URL should be collected"


class ListOfLinks(BaseSchema):
    """
    List of links with optional notes

    Notes:
        answer: list[tuple[str, str]], with [(some_url, some_note or "")]
    """

    question_type: Literal["list_of_links"]


class Input(BaseSchema):
    """
    Model for an input-based question where respondents enter text.

    Notes:
        answer: str, just user input
    """

    question_type: Literal["input"]
    "Indicates the type of question as 'input'."
    textarea: bool = False
    "Determines whether the input is a single-line field (False) or a textarea (True)."
    correct_answer: list[str] | None = None
    "List of acceptable correct answers as text (optional)."
    regex: str | None = None
    "Regex to validate input"
    name_of_column_in_export: str | None = None
    "How column with this input will be named in exported CSV"
    explanation: Explanation | None = None


class Ranking(BaseSchema):
    """
    Model for a ranking-type question, where options are ranked in a specified order.

    Notes:
        answer: list[int], with ranking of options [option_3, option_5, option_1, ...]
    """

    question_type: Literal["ranking"]
    "Indicates the type of question as 'ranking'."
    options: list[str]
    "List of options that must be ranked."
    correct_answer: list[int] | None = None
    "Correct order as a list of indices representing the ranking (optional)."
    explanation: Explanation | None = None


class Matching(BaseSchema):
    """
    Model for a matching-type question, where pairs are matched between two sets of options.

    Notes:
        answer: dict[int, int], with mapping between option sets
         {options_first_1: options_second_4, options_first_3: options_second_2}
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
    explanation: Explanation | None = None


class FormNode(BaseSchema):
    """
    Represents a single node in a form, containing content and a question.
    """

    id: int
    "Index in Form.nodes"
    content: Content
    "Content providing context, information, or instructions for the question."
    question: Union[
        SingleChoice,
        MultipleChoice,
        Scale,
        Ranking,
        Matching,
        Input,
        ListOfLinks,
        Contact,
        DateSelector,
    ] = Field(..., discriminator="question_type")
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
    shared_with: list[PydanticObjectId] = []
    "List of user ids with which user shared the document"
    created_at: datetime.datetime
    "Timestamp of when the form was created."
    created_by: PydanticObjectId
    "Identifier of the user or system that created the form."
    updated_at: datetime.datetime | None = None
    "Timestamp of the last update made to the form (optional)."
    updated_by: PydanticObjectId | None = None
    "Identifier of the user who last updated the form (optional)."
    deleted_at: datetime.datetime | None = None
    "Timestamp of when the form was deleted (optional)."
    deleted_by: PydanticObjectId | None = None
    "Identifier of the user who deleted the form (optional)."


class Form(FormSchema, CustomDocument):
    pass
