__all__ = ["AnswerRepository", "answer_repository"]

import datetime

from beanie import PydanticObjectId, UpdateResponse

from src.modules.respondee.schemas import ListAnswersFilter, UpsertAnswerReq
from src.storages.mongo.answers import Answer


class AnswerRepository:
    async def upsert(
        self,
        data: UpsertAnswerReq,
        *,
        invite_id: PydanticObjectId,
        session_id: str,
        form_id: PydanticObjectId,
    ) -> Answer:
        to_update = Answer(
            invite_id=invite_id,
            session_id=session_id,
            form_id=form_id,
            **data.model_dump(),
            updated_at=datetime.datetime.now(datetime.UTC),
        )

        return await Answer.find_one(
            {
                "invite_id": invite_id,
                "session_id": session_id,
                "form_id": form_id,
            }
        ).upsert(
            {
                "$set": {
                    "answers": data.answers,
                    "updated_at": datetime.datetime.now(datetime.UTC),
                }
            },
            response_type=UpdateResponse.NEW_DOCUMENT,
            on_insert=to_update,
        )

    async def get(self, form_id: PydanticObjectId, session_id: PydanticObjectId) -> Answer:
        return await Answer.find_one({"session_id": session_id, "form_id": form_id})

    async def list_answers(self, form_id: PydanticObjectId, filter: ListAnswersFilter) -> list[Answer]:
        res = Answer.find({"form_id": form_id})
        if filter.invite_id is not None:
            res = res.find({"invite_id": filter.invite_id})
        if filter.session_id is not None:
            res = res.find({"session_id": filter.session_id})

        return await res.to_list()


answer_repository: AnswerRepository = AnswerRepository()
