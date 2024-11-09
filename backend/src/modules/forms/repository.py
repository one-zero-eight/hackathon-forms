__all__ = ["FormRepository", "form_repository"]

import base64
import datetime
import hashlib
import random

from beanie import PydanticObjectId

from src.modules.forms.schemas import CreateFormReq, CreateInviteReq, UpdateFormReq
from src.storages.mongo import Invite
from src.storages.mongo.forms import Form


class FormRepository:
    async def create(self, data: CreateFormReq, *, created_by: PydanticObjectId) -> Form:
        created = Form(created_at=datetime.datetime.now(datetime.UTC), created_by=created_by, **data.model_dump())
        return await created.insert()

    async def get_active_invite_keys(self) -> list[str]:
        links = await Invite.find({"active": True}).aggregate([{"$project": {"key": 1}}]).to_list()

        return [link["keys"] for link in links]

    def generate_key_for_invite(self, form_id: PydanticObjectId, banned: set[str] = None) -> str:
        banned = banned or set()  # Use an empty set if no banned links are provided

        while True:
            # Generate a unique string with form_id and current timestamp
            unique_string = f"{form_id}-{datetime.datetime.now().timestamp()}-{random.randint(0, 9999)}"
            # Create a hash and encode it to base64 to ensure it’s URL-friendly
            hash_bytes = hashlib.sha256(unique_string.encode()).digest()
            # Encode to base64 and trim padding to keep it short
            link = base64.urlsafe_b64encode(hash_bytes).decode()[:10]

            # Check if link_id is in the banned list
            if link not in banned:
                return link

    async def create_invite(
        self, form_id: PydanticObjectId, data: CreateInviteReq, created_by: PydanticObjectId
    ) -> Invite:
        banned = await self.get_active_invite_keys()

        created = Invite(
            key=self.generate_key_for_invite(form_id, set(banned)),
            form_id=form_id,
            created_at=datetime.datetime.now(datetime.UTC),
            created_by=created_by,
            **data.model_dump(),
        )
        return await created.insert()

    async def use_invite(self, key: str, *, session_id: str) -> Invite | None:
        invite = await Invite.find_one({"key": key, "active": True})
        if not invite:
            return None
        if invite.one_time:
            await self.set_invite_active(invite_id=invite.id, active=False)
        await Invite.find({"_id": invite.id}).update({"$addToSet": {"used_by": session_id}})
        return invite

    async def set_invite_active(self, invite_id: PydanticObjectId, active: bool):
        await Invite.find({"_id": invite_id}).update({"$set": {"active": active}})

    async def get_invites(self, form_id: PydanticObjectId) -> list[Invite]:
        return await Invite.find({"form_id": form_id}).to_list()

    async def update(self, form_id: PydanticObjectId, user_id: PydanticObjectId, data: UpdateFormReq) -> Form | None:
        await Form.find_one({"_id": form_id}).update(
            {
                "$set": {
                    **data.model_dump(exclude_unset=True),
                    "updated_by": user_id,
                    "updated_at": datetime.datetime.now(datetime.UTC),
                }
            },
        )
        return await Form.find_one({"_id": form_id})

    async def delete(self, form_id: PydanticObjectId, user_id: PydanticObjectId) -> None:
        await Form.find({"_id": form_id}).update(
            {"$set": {"deleted_by": user_id, "deleted_at": datetime.datetime.now(datetime.UTC)}},
        )

    async def get(self, form_id: PydanticObjectId) -> Form | None:
        return await Form.find_one({"_id": form_id})

    async def get_all(self) -> list[Form]:
        return await Form.find().to_list()

    async def get_all_for_user(self, user_id: PydanticObjectId) -> list[Form]:
        return await Form.find({"created_by": user_id}).to_list()


form_repository: FormRepository = FormRepository()
