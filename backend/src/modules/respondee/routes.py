__all__ = ["router"]

from uuid import uuid4

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from starlette.requests import Request

from src.modules.forms.repository import form_repository
from src.storages.mongo.forms import Form

router = APIRouter(prefix="/as-respondee", tags=["Respondee"])


@router.post("/form/by-invite/{key}")
async def use_invite(key: str, request: Request):
    request.session["session_id"] = request.session.get("session_id") or str(uuid4())

    invite = await form_repository.use_invite(key, session_id=request.session["session_id"])
    if not invite:
        raise HTTPException(status_code=404)
    request.session["form_id"] = str(invite.form_id)


@router.get("/form/{form_id}/")
async def get_form_respondee(form_id: PydanticObjectId, request: Request) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)

    session_form_id = request.session.get("form_id")

    if PydanticObjectId(session_form_id) != form.id:
        raise HTTPException(status_code=403)
    return form
