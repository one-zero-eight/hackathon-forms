__all__ = ["router"]


from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from src.modules.forms.repository import form_repository
from src.storages.mongo.forms import Form

router = APIRouter(prefix="/form")


@router.get("/form/{form_id}")
async def get_form(form_id: PydanticObjectId) -> Form:
    form = await form_repository.get(form_id)
    if not form:
        raise HTTPException(status_code=404)
    return form
