__all__ = ["lifespan"]

import asyncio
import json
from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import timeout
from pymongo.errors import ConnectionFailure

from src.config import settings
from src.logging_ import logger
from src.modules.file_worker.repository import file_worker_repository
from src.modules.forms.example_quiz import as_create_form
from src.modules.forms.repository import form_repository
from src.modules.users.repository import user_repository
from src.storages.mongo import document_models


async def setup_database() -> AsyncIOMotorClient:
    motor_client: AsyncIOMotorClient = AsyncIOMotorClient(
        settings.database_uri.get_secret_value(),
        connectTimeoutMS=5000,
        serverSelectionTimeoutMS=5000,
        tz_aware=True,
    )
    motor_client.get_io_loop = asyncio.get_running_loop  # type: ignore[method-assign]

    # healthcheck mongo
    try:
        with timeout(2):
            server_info = await motor_client.server_info()
            server_info_pretty_text = json.dumps(server_info, indent=2, default=str)
            logger.info(f"Connected to MongoDB: {server_info_pretty_text}")
    except ConnectionFailure as e:
        logger.critical(f"Could not connect to MongoDB: {e}")
        raise e

    mongo_db = motor_client.get_database()
    await init_beanie(database=mongo_db, document_models=document_models, recreate_views=True)
    return motor_client


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Application startup
    motor_client = await setup_database()
    file_worker_repository.create_bucket()
    first = await user_repository.create_admin_if_not_exist(settings.first_user.email, settings.first_user.name)
    if not await form_repository.get_by_title(as_create_form.title):
        await form_repository.create(as_create_form, first.id)
    yield

    # -- Application shutdown --
    motor_client.close()
