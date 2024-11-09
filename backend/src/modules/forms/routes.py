__all__ = ["router"]

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from src.api.dependencies import CURRENT_USER_ID_DEPENDENCY
from src.modules.forms.repository import form_repository
from src.modules.forms.schemas import CreateFormReq, CreateInviteReq, UpdateFormReq
from src.modules.respondee.repository import answer_repository
from src.modules.respondee.schemas import ListAnswersFilter
from src.modules.users.repository import user_repository
from src.storages.mongo import Invite
from src.storages.mongo.answers import Answer
from src.storages.mongo.forms import Form
from src.storages.mongo.users import UserRole

router = APIRouter(prefix="/form", tags=["Forms"])


async def can_edit_form_guard(form_id: PydanticObjectId, user_id: PydanticObjectId | None) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)

    if user_id is not None:
        user = await user_repository.read(user_id)
        if user.role in (UserRole.ADMIN, UserRole.MANAGER):
            return form
        elif user.id == form.created_by:
            return form
        elif user.id in form.shared_with:
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


@router.get("/{form_id}/statistics/")
async def get_stats(form_id: PydanticObjectId, user_id: CURRENT_USER_ID_DEPENDENCY):
    _ = await can_edit_form_guard(form_id, user_id)
    raise NotImplementedError


@router.post("/{form_id}/answers")
async def list_answers(form_id: PydanticObjectId, filter: ListAnswersFilter) -> list[Answer]:
    return await answer_repository.list_answers(form_id, filter)
