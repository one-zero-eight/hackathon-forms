from typing import Any, ClassVar

from fastapi import HTTPException
from starlette import status


class CustomHTTPException(HTTPException):
    responses: ClassVar[dict[int | str, dict[str, Any]]]


class IncorrectCredentialsException(CustomHTTPException):
    """
    HTTP_401_UNAUTHORIZED
    """

    def __init__(self, no_credentials: bool = False):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=self.responses[401]["description"],
        )

    responses = {401: {"description": "Unable to verify credentials OR Credentials not provided"}}


class NotEnoughPermissionsException(HTTPException):
    """
    HTTP_403_FORBIDDEN
    """

    def __init__(self, detail: str | None = None) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail or self.responses[403]["description"],
        )

    responses = {403: {"description": "Not enough permissions"}}


class Duplicate(HTTPException):
    """
    HTTP_409_CONFLICT
    """

    def __init__(self, detail: str | None = None) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail or self.responses[409]["description"],
        )

    responses = {409: {"description": "Duplicate key error"}}
