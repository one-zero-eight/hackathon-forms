from enum import StrEnum
from pathlib import Path

import yaml
from pydantic import ConfigDict, Field, SecretStr

from src.pydantic_base import BaseSchema


class Environment(StrEnum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"


class SettingBase(BaseSchema):
    model_config = ConfigDict(use_attribute_docstrings=True, extra="forbid")


class SMTP(SettingBase):
    host: str
    "SMTP server host"
    port: int = 587
    "SMTP server port"
    username: str
    "SMTP server username"
    password: SecretStr
    "SMTP server password"


class MinioSettings(SettingBase):
    endpoint: str = "127.0.0.1:9000"
    "URL of the target service."
    secure: bool = False
    "Use https connection to the service."
    bucket: str = "search"
    "Name of the bucket in the service."
    access_key: str = Field(..., examples=["minioadmin"])
    "Access key (user ID) of a user account in the service."
    secret_key: SecretStr = Field(..., examples=["password"])
    "Secret key (password) for the user account."


class Settings(SettingBase):
    """
    Settings for the application.
    """

    schema_: str = Field(None, alias="$schema")
    environment: Environment = Environment.DEVELOPMENT
    "App environment flag"
    app_root_path: str = ""
    'Prefix for the API path (e.g. "/api/v0")'
    session_secret_key: SecretStr
    "Secret key for session middleware"
    database_uri: SecretStr = Field(..., examples=["mongodb://mongoadmin:secret@localhost:27017/db?authSource=admin"])
    "MongoDB database settings"
    cors_allow_origins: list[str] = ["https://innohassle.ru", "https://pre.innohassle.ru", "http://localhost:3000"]
    "Allowed origins for CORS: from which domains requests to the API are allowed"
    smtp: SMTP | None = None
    "SMTP settings"
    minio: MinioSettings

    @classmethod
    def from_yaml(cls, path: Path) -> "Settings":
        with open(path, encoding="utf-8") as f:
            yaml_config = yaml.safe_load(f)

        return cls.model_validate(yaml_config)

    @classmethod
    def save_schema(cls, path: Path) -> None:
        with open(path, "w", encoding="utf-8") as f:
            schema = {"$schema": "http://json-schema.org/draft-07/schema#", **cls.model_json_schema()}
            yaml.dump(schema, f, sort_keys=False)
