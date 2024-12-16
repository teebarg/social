import uuid
from datetime import datetime

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    first_name: str | None = Field(default=None, max_length=255)
    last_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    first_name: str | None = Field(default=None, max_length=255)
    last_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    first_name: str | None = Field(default=None, max_length=255)
    last_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    drafts: list["Draft"] = Relationship(back_populates="user", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class TweetBase(SQLModel):
    content: str = Field(min_length=1, max_length=255)


# Properties to receive on item creation
class TweetCreate(TweetBase):
    pass


# Database model, database table inferred from class name
class Tweet(TweetBase, table=True):
    __tablename__ = "tweets"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str = Field(max_length=255)
    twitter_id: str = Field(max_length=255)
    created_at: datetime = Field(default=datetime.now())


# Properties to return via API, id is always required
class TweetPublic(TweetBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class TweetsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


class DraftBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1, max_length=255)
    image_url: str | None = Field(default=None, max_length=255)
    link_url: str | None = Field(default=None, max_length=255)
    platform: str | None = Field(default=None, max_length=100)
    scheduled_time: datetime| None = None
    is_published: bool = Field(default=False)
    created_at: datetime | None = Field(default=datetime.now())
    updated_at: datetime | None = Field(default=datetime.now())


# Properties to receive on Draft creation
class DraftCreate(DraftBase):
    pass


# Properties to receive on Draft update
class DraftUpdate(DraftBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore
    content: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Draft(DraftBase, table=True):
    __tablename__ = "drafts"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    user: User | None = Relationship(back_populates="drafts")


# Properties to return via API, id is always required
class DraftPublic(DraftBase):
    id: uuid.UUID
    user_id: uuid.UUID


class DraftsPublic(SQLModel):
    data: list[DraftPublic]
    count: int

class PushSubscriptionBase(SQLModel):
    endpoint: str = Field(min_length=1, max_length=255, unique=True, index=True)
    p256dh: str = Field(min_length=1, max_length=255)
    auth: str = Field(min_length=1, max_length=255)
    group: str | None = Field(default=None, max_length=255)
    created_at: datetime | None = Field(default=datetime.now())

class PushSubscription(PushSubscriptionBase, table=True):
    __tablename__ = "push_subscriptions"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


# Shared properties
class NotificationTemplateBase(SQLModel):
    icon: str = Field(min_length=1, max_length=255)
    title: str = Field(min_length=1, max_length=255)
    body: str = Field(min_length=1, max_length=255)
    excerpt: str = Field(min_length=1, max_length=255)
    created_at: datetime | None = Field(default=datetime.now())


# Properties to receive on item creation
class NotificationTemplateCreate(NotificationTemplateBase):
    pass


# Properties to receive on item update
class NotificationTemplateUpdate(NotificationTemplateBase):
    pass


# Database model, database table inferred from class name
class NotificationTemplate(NotificationTemplateBase, table=True):
    __tablename__ = "notification_templates"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


# Properties to return via API, id is always required
class NotificationTemplatePublic(NotificationTemplateBase):
    id: uuid.UUID


class NotificationTemplatesPublic(SQLModel):
    data: list[NotificationTemplatePublic]
