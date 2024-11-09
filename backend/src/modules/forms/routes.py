__all__ = ["router"]


from typing import Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Body, HTTPException

from src.modules.forms.repository import form_repository
from src.modules.forms.schemas import CreateFormReq
from src.storages.mongo.forms import Form

router = APIRouter(prefix="/form")


@router.get("/{form_id}")
async def get_form(form_id: PydanticObjectId) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)
    return form


@router.post("/")
async def create_form(req: Annotated[CreateFormReq, Body(embed=True)]) -> Form:
    form = await form_repository.create(req)
    return form
