import io

from fastapi import HTTPException

from src.modules.file_worker.client import minio_client


class FileWorker:
    def create_bucket(self):
        if not minio_client.bucket_exists(bucket_name="candidate-iq"):
            minio_client.make_bucket("candidate-iq")

    async def upload_file(self, filename: str, file_data: bytes, file_size: int) -> str:
        res = minio_client.put_object(
            bucket_name="candidate-iq", object_name=filename, data=io.BytesIO(file_data), length=file_size
        )
        return f"{res.bucket_name}/{res.object_name}"

    async def download_file(self, bucket_name: str, object_name: str) -> bytes:
        res = minio_client.get_object(bucket_name=bucket_name, object_name=object_name)
        if res.status == 200:
            return res.data
        if res.status == 404:
            raise HTTPException(status_code=404)
        raise HTTPException(status_code=500, detail=res.reason)


file_worker_repository: FileWorker = FileWorker()
