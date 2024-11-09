__all__ = ["QuestionTypes, ContentType"]

from pymongo import IndexModel
from typing import Union, Literal
from enum import StrEnum
from pydantic import Field, BaseModel
from datetime import datetime

from src.pydantic_base import BaseSchema
from src.storages.mongo.__base__ import CustomDocument

class MediaContent(BaseModel):
    url: str

class AudioContent(MediaContent):
    content_type: Literal['audio']

class VideoContent(MediaContent):
    content_type: Literal['video']

class TextContent(BaseModel):
    content_type: Literal['text']

class SingleChoice(BaseModel):
    question_type: Literal['select']
    options: list[str]
    correct_answer: str
    user_answer: str

class MultipleChoice(BaseModel):
    question_type: Literal['question_type']
    options: list[str]
    correct_answers: list[str]
    user_answer: list[str]

class Scale(BaseModel):
    question_type: Literal['scale']
    scale: list[int]
    user_answer: int

class Text(BaseModel):
    question_type: Literal['text']
    user_answer: str

class Ranking(BaseModel):
    question_type: Literal['ranking']
    options: list[str]
    user_answer: list[str]

class Matching(BaseModel):
    question_type: Literal['matching']
    options_first: list[str]
    options_second: list[str]
    correct_answer: dict[int, int]

class FormNode(BaseModel):
    content: Union[AudioContent, VideoContent, TextContent] = Field(..., discriminator='content_type')  
    question: Union[SingleChoice, MultipleChoice, Scale, Text, Ranking, Matching] = Field(..., discriminator="question_type")
    next_node: int 

class FormSchema(BaseSchema):
    form_uuid: str
    description: str
    nodes: list[FormNode]
    created_at: datetime
    created_by: str
    updated_at: datetime
    updated_by: str
    deleted_at: datetime
    deleted_by: str

class Form(FormSchema, CustomDocument):
    pass