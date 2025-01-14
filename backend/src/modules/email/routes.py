__all__ = ["router"]

from typing import Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel, EmailStr
from starlette.requests import Request

from src.config import settings
from src.config_schema import Environment
from src.modules.email.repository import EmailFlowVerificationStatus, email_flow_repository
from src.modules.users.repository import user_repository

router = APIRouter(prefix="/email", tags=["Email"])


class EmailFlowReference(BaseModel):
    email_flow_id: PydanticObjectId


class EmailFlowResult(BaseModel):
    status: EmailFlowVerificationStatus
    email: str | None = None


@router.post("/login")
async def start_email_flow(email: Annotated[EmailStr, Body(embed=True)]) -> EmailFlowReference:
    from src.modules.smtp.repository import smtp_repository

    user = await user_repository.read_by_email(email=email)

    if not user:
        raise HTTPException(status_code=404)

    email_flow = await email_flow_repository.start_flow(email, user.id, None)
    message = smtp_repository.render_verification_message(email_flow.email, email_flow.verification_code)
    smtp_repository.send(message, email_flow.email)
    await email_flow_repository.set_sent(email_flow.id)
    return EmailFlowReference(email_flow_id=email_flow.id)


@router.post("/validate-code-for-users")
async def end_email_flow(
    email_flow_id: Annotated[PydanticObjectId, Body()],
    verification_code: Annotated[str, Body()],
    request: Request,
) -> EmailFlowResult:
    if settings.environment == Environment.DEVELOPMENT:
        if verification_code == "666666":
            users = await user_repository.get_all()
            if len(users):
                request.session["uid"] = str(users[0].id)
                return EmailFlowResult(status=EmailFlowVerificationStatus.SUCCESS, email=users[0].email)
        if verification_code == "777777":
            users = await user_repository.get_all()
            if len(users):
                request.session["uid"] = str(users[1].id)
                return EmailFlowResult(status=EmailFlowVerificationStatus.SUCCESS, email=users[1].email)
        if verification_code == "888888":
            users = await user_repository.get_all()
            if len(users):
                request.session["uid"] = str(users[2].id)
                return EmailFlowResult(status=EmailFlowVerificationStatus.SUCCESS, email=users[2].email)

    verification_result = await email_flow_repository.verify_flow(email_flow_id, verification_code)

    if verification_result.status == EmailFlowVerificationStatus.SUCCESS:
        request.session["uid"] = str(verification_result.email_flow.user_id)
        return EmailFlowResult(
            status=verification_result.status,
            email=verification_result.email_flow.email if verification_result.email_flow else None,
        )
    raise HTTPException(400)
