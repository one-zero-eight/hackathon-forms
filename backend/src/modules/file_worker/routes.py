__all__ = ["router"]

import magic
from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

from src.modules.file_worker.repository import file_worker_repository

router = APIRouter(prefix="/file_worker", tags=["FileWorker"])


class DownloadFileReq(BaseModel):
    url: str


@router.post("/upload")
async def upload_file(file: UploadFile) -> str:
    resp = await file_worker_repository.upload_file(file.filename, file.file.read(), file.size)
    return resp


@router.get("/download")
async def download_file(url: str) -> Response:
    fp_group = url.split("/")
    if len(fp_group) != 2:
        raise HTTPException(status_code=400)
    bucket_name, file_name = fp_group[0], fp_group[1]
    resp = await file_worker_repository.download_file(bucket_name, file_name)
    print(magic.from_buffer(resp, mime=True))
    return Response(content=resp, media_type=magic.from_buffer(resp, mime=True))
