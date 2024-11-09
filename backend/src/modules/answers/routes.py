__all__ = ["router"]

from fastapi import APIRouter

from src.modules.answers.repository import answer_repository
from src.modules.answers.schemas import UpsertAnswerReq
from src.storages.mongo.answers import Answer

router = APIRouter(prefix="/answer", tags=["Answers"])


@router.put("/")
async def upsert_answer(req: UpsertAnswerReq) -> Answer:
    return await answer_repository.upsert(req)
