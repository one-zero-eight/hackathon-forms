__all__ = ["FormRepository", "form_repository"]

import datetime

from beanie import PydanticObjectId

from src.modules.forms.schemas import CreateFormReq
from src.storages.mongo.forms import Form


class FormRepository:
    async def create(self, form: CreateFormReq) -> Form:
        created = Form(created_at=datetime.datetime.now(datetime.UTC), **form.model_dump())
        return await created.insert()

    async def delete(self, form_id: PydanticObjectId, user_id: int) -> None:
        await Form.update(
            {
                "_id": form_id,
            },
            {
                "$set": {
                    "deleted_by": user_id,
                    "deleted_at": datetime.datetime.now(datetime.UTC),
                }
            },
        )

    async def get(self, form_id: PydanticObjectId) -> Form | None:
        return await Form.find_one({"_id": form_id})


form_repository: FormRepository = FormRepository()
