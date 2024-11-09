__all__ = ["UserRepository", "user_repository"]

from beanie import PydanticObjectId

from src.modules.users.schemas import CreateUser
from src.storages.mongo.users import User, UserRole


# noinspection PyMethodMayBeStatic
class UserRepository:
    async def create_hr_user(self, user: CreateUser) -> User:
        created = User(**user.model_dump(), role=UserRole.HR)
        return await created.insert()

    async def read(self, user_id: PydanticObjectId) -> User | None:
        return await User.get(user_id)

    async def promote(self, user_id: PydanticObjectId, role: UserRole) -> User | None:
        user = await User.find_one({"_id": user_id})
        if not user:
            return None
        user.role = role
        await user.save()
        return user

    async def read_by_email(self, email: str) -> User | None:
        return await User.find_one({"email": email})

    async def exists(self, user_id: PydanticObjectId) -> bool:
        exists = bool(await User.find(User.id == user_id, limit=1).count())
        return exists

    async def is_banned(self, user_id: PydanticObjectId) -> bool:
        exists = bool(await User.find(User.id == user_id, User.role == UserRole.BANNED, limit=1).count())
        return exists

    async def get_all(self) -> list[User]:
        return await User.find().to_list()


user_repository: UserRepository = UserRepository()
