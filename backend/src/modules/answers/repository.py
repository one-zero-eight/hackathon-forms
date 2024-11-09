__all__ = ["AnswerRepository", "answer_repository"]

import datetime

from beanie import UpdateResponse

from src.modules.answers.schemas import UpsertAnswerReq
from src.storages.mongo.answers import Answer


class AnswerRepository:
    async def upsert(self, req: UpsertAnswerReq) -> Answer:
        to_update = Answer(**req.model_dump(), updated_at=datetime.datetime.now(datetime.UTC))

        return await Answer.find_one(
            {
                "invite_id": req.invite_id,
                "session_id": req.session_id,
                "form_id": req.form_id,
            }
        ).upsert(
            {
                "$set": {
                    "form_id": req.form_id,
                    "answers": req.answers,
                    "updated_at": datetime.datetime.now(datetime.UTC),
                }
            },
            response_type=UpdateResponse.NEW_DOCUMENT,
            on_insert=to_update,
        )


answer_repository: AnswerRepository = AnswerRepository()
