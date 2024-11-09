__all__ = ["CURRENT_USER_ID_DEPENDENCY"]

from typing import Annotated

from beanie import PydanticObjectId
from fastapi import Depends, HTTPException
from starlette.requests import Request

from src.api.exceptions import IncorrectCredentialsException
from src.modules.users.repository import user_repository


async def _get_uid_from_session(request: Request) -> PydanticObjectId:
    uid = await get_optional_uid_from_session(request)
    if uid is None:
        raise IncorrectCredentialsException()
    return uid


async def get_optional_uid_from_session(request: Request) -> PydanticObjectId | None:
    uid = request.session.get("uid")

    if uid is None:
        return None
    uid = PydanticObjectId(uid)
    exists = await user_repository.exists(uid)
    if not exists:
        request.session.clear()
        raise IncorrectCredentialsException()

    banned = await user_repository.is_banned(uid)
    if banned:
        raise HTTPException(status_code=403, detail="You are banned 🥹")

    return uid


CURRENT_USER_ID_DEPENDENCY = Annotated[int, Depends(_get_uid_from_session)]
