__all__ = ["router"]

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from src.api.dependencies import CURRENT_USER_ID_DEPENDENCY
from src.modules.forms.repository import form_repository
from src.modules.forms.schemas import CreateFormReq, CreateInviteReq
from src.storages.mongo import Invite
from src.storages.mongo.forms import Form

router = APIRouter(prefix="/form", tags=["Forms"])


@router.get("/{form_id}")
async def get_form(form_id: PydanticObjectId) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)
    return form


@router.post("/")
async def create_form(data: CreateFormReq, user_id: CURRENT_USER_ID_DEPENDENCY) -> Form:
    data = await form_repository.create(data, created_by=user_id)
    return data


@router.post("/{form_id}/invite/")
async def create_invite(
    form_id: PydanticObjectId, data: CreateInviteReq, user_id: CURRENT_USER_ID_DEPENDENCY
) -> Invite:
    data = await form_repository.create_invite(form_id, data, created_by=user_id)
    return data


@router.get("/{form_id}/invite/")
async def get_invites(form_id: PydanticObjectId, user_id: CURRENT_USER_ID_DEPENDENCY) -> list[Invite]:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)

    data = await form_repository.get_invites(form_id)
    return data
