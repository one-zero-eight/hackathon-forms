__all__ = ["router"]

from fastapi import APIRouter, HTTPException, Request

from src.modules.answers.repository import answer_repository
from src.modules.answers.schemas import UpsertAnswerReq
from src.storages.mongo.answers import Answer

router = APIRouter(prefix="/answer", tags=["Answers"])


@router.put("/")
async def upsert_answer(req: UpsertAnswerReq) -> Answer:
    return await answer_repository.upsert(req)


@router.get("/")
async def get_last_answer_state(req: Request) -> Answer:
    session_id = req.session.get("session_id")
    form_id = req.session.get("form_id")
    if session_id is None or form_id is None:
        raise HTTPException(status_code=404)
    response = await answer_repository.get(form_id, session_id)
    if response is None:
        raise HTTPException(status_code=404)
    return response
