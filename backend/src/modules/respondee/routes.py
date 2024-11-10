__all__ = ["router"]

from uuid import uuid4

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from starlette.requests import Request

from src.modules.forms.repository import form_repository
from src.modules.respondee.repository import answer_repository
from src.modules.respondee.schemas import UpsertAnswerReq
from src.storages.mongo import Invite
from src.storages.mongo.answers import Answer
from src.storages.mongo.forms import Form

router = APIRouter(prefix="/as-respondee", tags=["Respondee"])


@router.post("/form/by-invite/{key}")
async def use_invite(key: str, request: Request) -> Invite:
    request.session["session_id"] = request.session.get("session_id") or str(uuid4())

    invite = await form_repository.use_invite(key, session_id=request.session["session_id"])
    if not invite:
        raise HTTPException(status_code=404)
    request.session["form_id"] = str(invite.form_id)
    request.session["invite_id"] = str(invite.id)
    return invite


async def can_interact_guard(form_id: PydanticObjectId, request: Request) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)

    session_form_id = request.session.get("form_id")

    if PydanticObjectId(session_form_id) != form.id:
        raise HTTPException(status_code=403)

    return form


@router.get("/form/{form_id}/")
async def get_form_as_respondee(form_id: PydanticObjectId, request: Request) -> Form:
    return await can_interact_guard(form_id, request)


@router.put("/form/{form_id}/answers/")
async def upsert_answer(form_id: PydanticObjectId, request: Request, data: UpsertAnswerReq) -> Answer:
    form = await can_interact_guard(form_id, request)
    return await answer_repository.upsert(
        data,
        form_id=form.id,
        invite_id=PydanticObjectId(request.session["invite_id"]),
        session_id=request.session["session_id"],
    )


@router.get("/form/{form_id}/answers/")
async def get_my_answers(form_id: PydanticObjectId, request: Request) -> Answer:
    _ = await can_interact_guard(form_id, request)
    session_id = request.session.get("session_id")
    response = await answer_repository.get(form_id, session_id)
    if response is None:
        raise HTTPException(status_code=404, detail="No answers yet")
    return response
