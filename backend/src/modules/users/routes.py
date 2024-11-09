import pymongo.errors
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from src.api.dependencies import CURRENT_USER_ID_DEPENDENCY
from src.api.exceptions import Duplicate, IncorrectCredentialsException, NotEnoughPermissionsException
from src.logging_ import logger
from src.modules.users.repository import user_repository
from src.modules.users.schemas import CreateUser
from src.storages.mongo import User
from src.storages.mongo.users import UserRole

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={
        **IncorrectCredentialsException.responses,
    },
)


@router.get("/me", responses={200: {"description": "Current user info"}})
async def get_me(user_id: CURRENT_USER_ID_DEPENDENCY) -> User:
    """
    Get current user info if authenticated
    """

    user = await user_repository.read(user_id)
    return user


@router.get("/", responses={200: {"description": "List of users"}})
async def get_users(_: CURRENT_USER_ID_DEPENDENCY) -> list[User]:
    return await user_repository.get_all()


@router.post("/promote")
async def promote(user_id: CURRENT_USER_ID_DEPENDENCY, target_user_id: PydanticObjectId, role: UserRole) -> User:
    user = await user_repository.read(user_id)

    if user.role != UserRole.ADMIN or role == UserRole.ADMIN:
        raise NotEnoughPermissionsException()
    target_user = await user_repository.read(target_user_id)
    if not target_user:
        raise HTTPException(status_code=404)

    if target_user.role == UserRole.ADMIN:
        raise HTTPException(status_code=409)

    target_user = await user_repository.promote(target_user_id, role=role)
    if target_user is None:
        raise HTTPException(status_code=404)

    return target_user


@router.post(
    "/new-hr", responses={200: {"description": "Created user info"}, **NotEnoughPermissionsException.responses}
)
async def create_hr(user_id: CURRENT_USER_ID_DEPENDENCY, data: CreateUser) -> User:
    """
    Create HR-user. Requires admin rights.
    """
    user = await user_repository.read(user_id)

    if user.role != UserRole.ADMIN:
        raise NotEnoughPermissionsException()

    try:
        new_user = await user_repository.create_hr_user(data)
    except pymongo.errors.DuplicateKeyError as e:
        logger.warning(e)
        raise Duplicate()
    return new_user
