from typing import cast

from beanie import Document, View

from src.storages.mongo.answers import Answer
from src.storages.mongo.email import EmailFlow
from src.storages.mongo.forms import Form
from src.storages.mongo.invites import Invite
from src.storages.mongo.users import User

document_models = cast(
    list[type[Document] | type[View] | str],
    [User, EmailFlow, Invite, Form, Answer],
)
