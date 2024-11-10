__all__ = ["router"]

import datetime
import json
from collections import Counter, defaultdict
from typing import Any, TypedDict

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from pydantic import TypeAdapter, ValidationError

from src.api.dependencies import CURRENT_USER_ID_DEPENDENCY
from src.logging_ import logger
from src.modules.forms.repository import form_repository
from src.modules.forms.schemas import CreateFormReq, CreateInviteReq, UpdateFormReq
from src.modules.respondee.repository import answer_repository
from src.modules.respondee.schemas import ListAnswersFilter
from src.modules.users.repository import user_repository
from src.pydantic_base import BaseSchema
from src.storages.mongo import Invite
from src.storages.mongo.answers import Answer
from src.storages.mongo.forms import (
    DateSelector,
    Form,
    FormNode,
    Input,
    Matching,
    MultipleChoice,
    Ranking,
    Scale,
    SingleChoice,
)
from src.storages.mongo.users import UserRole

router = APIRouter(prefix="/form", tags=["Forms"])


async def can_edit_form_guard(
    form_id: PydanticObjectId, user_id: PydanticObjectId | None, edit_shared_with: bool = False
) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)

    if user_id is not None:
        user = await user_repository.read(user_id)
        if user.role in (UserRole.ADMIN, UserRole.MANAGER):
            return form
        elif user.id == form.created_by:
            return form
        elif user.id in form.shared_with and not edit_shared_with:
            return form
    raise HTTPException(status_code=403)


@router.get("/")
async def get_forms(user_id: CURRENT_USER_ID_DEPENDENCY) -> list[Form]:
    user = await user_repository.read(user_id)
    if user.role in (UserRole.ADMIN, UserRole.MANAGER):
        return await form_repository.get_all()
    else:
        return await form_repository.get_all_for_user(user_id)


@router.get("/{form_id}")
async def get_form(form_id: PydanticObjectId, user_id: CURRENT_USER_ID_DEPENDENCY) -> Form:
    return await can_edit_form_guard(form_id, user_id)


@router.post("/")
async def create_form(data: CreateFormReq, user_id: CURRENT_USER_ID_DEPENDENCY) -> Form:
    data = await form_repository.create(data, created_by=user_id)
    return data


@router.put("/{form_id}")
async def update_form(form_id: PydanticObjectId, data: UpdateFormReq, user_id: CURRENT_USER_ID_DEPENDENCY) -> None:
    _ = await can_edit_form_guard(form_id, user_id)
    return await form_repository.update(form_id, user_id=user_id, data=data)


@router.put("/{form_id}/share_with")
async def share_with(
    form_id: PydanticObjectId, shared_with_group: list[PydanticObjectId], req_id: CURRENT_USER_ID_DEPENDENCY
):
    _ = await can_edit_form_guard(form_id, req_id, True)
    return await form_repository.share_with(req_id, form_id, shared_with_group)


@router.delete("/{form_id}")
async def delete_form(form_id: PydanticObjectId, user_id: CURRENT_USER_ID_DEPENDENCY) -> None:
    _ = await can_edit_form_guard(form_id, user_id)
    await form_repository.delete(form_id, user_id=user_id)


@router.post("/{form_id}/invite/")
async def create_invite(
    form_id: PydanticObjectId, data: CreateInviteReq, user_id: CURRENT_USER_ID_DEPENDENCY
) -> Invite:
    _ = await can_edit_form_guard(form_id, user_id)
    data = await form_repository.create_invite(form_id, data, created_by=user_id)
    return data


@router.get("/{form_id}/invite/")
async def get_invites(form_id: PydanticObjectId, user_id: CURRENT_USER_ID_DEPENDENCY) -> list[Invite]:
    _ = await can_edit_form_guard(form_id, user_id)
    data = await form_repository.get_invites(form_id)
    return data


class Stats(BaseSchema):
    class ByNode(TypedDict):
        node: FormNode
        answers: list[Any]
        with_no_answer: int
        counter: dict[str | int, int]

    total_answers: int
    total_questions: int
    by_nodes: dict[int, ByNode]


@router.get("/{form_id}/statistics/")
async def get_stats(form_id: PydanticObjectId, user_id: CURRENT_USER_ID_DEPENDENCY) -> Stats:
    form = await can_edit_form_guard(form_id, user_id)
    answers = await answer_repository.list_answers(form_id, ListAnswersFilter())
    nodes = form.nodes
    by_nodes: dict[int, Stats.ByNode] = defaultdict(dict)

    for node in nodes:
        by_nodes[node.id]["node"] = node
        answers_on_that_question = [answer.answers.get(node.id) for answer in answers]
        by_nodes[node.id]["answers"] = answers_on_that_question
        nones = answers_on_that_question.count(None)
        by_nodes[node.id]["with_no_answer"] = nones
        answers_on_that_question = filter(None, answers_on_that_question)
        counter = Counter()
        try:
            if isinstance(node.question, SingleChoice):
                type_adapter = TypeAdapter(list[int | str])
                counter.update(type_adapter.validate_python(answers_on_that_question))
            elif isinstance(node.question, DateSelector):
                type_adapter = TypeAdapter(list[datetime.date | datetime.datetime])
                counter.update(type_adapter.validate_python(answers_on_that_question))
            elif isinstance(node.question, MultipleChoice):
                type_adapter = TypeAdapter(list[list[int | str]])
                for _ in type_adapter.validate_python(answers_on_that_question):
                    counter.update(_)
            elif isinstance(node.question, Scale):
                type_adapter = TypeAdapter(list[int | str])
                counter.update(type_adapter.validate_python(answers_on_that_question))
            elif isinstance(node.question, Input):
                type_adapter = TypeAdapter(list[str])
                counter.update(type_adapter.validate_python(answers_on_that_question))
            elif isinstance(node.question, Ranking):
                type_adapter = TypeAdapter(list[list[int | str]])
                counter.update(
                    [json.dumps(ranking) for ranking in type_adapter.validate_python(answers_on_that_question)]
                )
            elif isinstance(node.question, Matching):
                type_adapter = TypeAdapter(list[dict])
                for ranking in type_adapter.validate_python(answers_on_that_question):
                    for k, v in ranking.items():
                        counter.update([json.dumps({k: v})])

        except ValidationError as e:
            logger.warning(e)
        by_nodes[node.id]["counter"] = counter

    return Stats(total_answers=len(answers), total_questions=len(nodes), by_nodes=by_nodes)


@router.post("/{form_id}/answers")
async def list_answers(
    form_id: PydanticObjectId, filter: ListAnswersFilter, user_id: CURRENT_USER_ID_DEPENDENCY
) -> list[Answer]:
    _ = await can_edit_form_guard(form_id, user_id)
    return await answer_repository.list_answers(form_id, filter)
