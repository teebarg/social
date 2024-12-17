import json
import uuid
from app.models import Message, NotificationTemplate, NotificationTemplateCreate, NotificationTemplatePublic, NotificationTemplateUpdate, NotificationTemplatesPublic, PushSubscription
from fastapi import (
    APIRouter,
    HTTPException,
    BackgroundTasks
)
from pydantic import BaseModel


from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional

from pywebpush import webpush, WebPushException

from app.api.deps import SessionDep
from app.core.config import settings
from sqlmodel import  select
import psycopg2
from psycopg2.errors import UniqueViolation
from sqlalchemy.exc import IntegrityError


# Create a router for collections
router = APIRouter()

# VAPID keys
VAPID_PRIVATE_KEY = settings.VAPID_PRIVATE_KEY
VAPID_CLAIMS = {"sub": "mailto:{}".format(settings.ADMIN_EMAIL)}


# Pydantic models
class PushSubscriptionRequest(BaseModel):
    endpoint: str
    keys: dict
    group: Optional[str] = None  # Optional group for the subscription

class PushSubscriptionSearch(BaseModel):
    endpoint: str

class NotificationRequest(BaseModel):
    title: str
    body: str
    group: Optional[str] = None  # Target group
    users: Optional[List[int]] = None  # Specific user IDs to target

class NotificationTemplateRequest(BaseModel):
    title: str
    body: str
    icon: Optional[str] = None
    exert: Optional[str] = None

class NotificationTemplateSearch(BaseModel):
    title: str


@router.get("/templates")
def get_templates(db: SessionDep, skip: int = 0, limit: int = 100):
    """Get notification templates."""

    statement = select(NotificationTemplate).offset(skip).limit(limit)
    items = db.exec(statement).all()

    return NotificationTemplatesPublic(data=items)


@router.post("/templates", response_model=NotificationTemplatePublic)
def create_notification_template(
    *, db: SessionDep, item_in: NotificationTemplateCreate
):
    """
    Create new notification template.
    """
    item = NotificationTemplate.model_validate(item_in)
    try:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    except IntegrityError as e:
        # Check if it's a UniqueViolation error
        if isinstance(e.orig, UniqueViolation):
            raise HTTPException(status_code=422, detail="Duplicate entry detected!")
        else:
            # Re-raise if it's another IntegrityError
            raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="An error occurred")


@router.put("/templates/{id}", response_model=NotificationTemplatePublic)
def update_create_notification_template(
    *,
    db: SessionDep,
    id: uuid.UUID,
    item_in: NotificationTemplateUpdate,
):
    """
    Update a notification template.
    """
    item = db.get(NotificationTemplate, id)
    if not item:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check if the updated title already exists in another template
    if item_in.title and db.query(NotificationTemplate).filter(NotificationTemplate.title == item_in.title, NotificationTemplate.id != id).first():
        raise HTTPException(status_code=422, detail="Title already exists in another template.")
    
    update_dict = item_in.model_dump(exclude_unset=True)
    item.sqlmodel_update(update_dict)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/subscription")
def get_subscription_by_endpoint(db: SessionDep, data: PushSubscriptionSearch):
    """Get a subscription by its endpoint."""
    subscription = db.query(PushSubscription).filter_by(endpoint=data.endpoint).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription


@router.post("/subscribe")
async def subscribe(subscription: PushSubscriptionRequest, db: SessionDep):
    """Save a push subscription."""
    existing_subscription = db.query(PushSubscription).filter_by(endpoint=subscription.endpoint).first()

    if existing_subscription:
        raise HTTPException(status_code=422, detail="Subscription already exists.")

    new_subscription = PushSubscription(
        endpoint=subscription.endpoint,
        p256dh=subscription.keys["p256dh"],
        auth=subscription.keys["auth"],
        group=subscription.group,
    )
    db.add(new_subscription)
    db.commit()
    return {"message": "Subscription added successfully."}


@router.delete("/{id}")
def unsubscribe(
    db: SessionDep, id: str
) -> Message:
    """
    Delete a push subscription.
    """
    statement = select(PushSubscription).where(PushSubscription.auth == id)
    item = db.exec(statement).first()
    if not item:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(item)
    db.commit()
    return Message(message="Subscription deleted successfully")


@router.post("/")
async def send_notification(notification: NotificationRequest, db: SessionDep, background_tasks: BackgroundTasks):
    """Send push notifications to a target group or specific users."""
    if not notification.group and not notification.users:
        raise HTTPException(status_code=400, detail="Group or user IDs must be specified.")

    # Fetch subscriptions based on group or user IDs
    if notification.group:
        subscriptions = db.query(PushSubscription).filter_by(group=notification.group).all()
    elif notification.users:
        subscriptions = db.query(PushSubscription).filter(PushSubscription.id.in_(notification.users)).all()
    else:
        subscriptions = []

    if not subscriptions:
        raise HTTPException(status_code=404, detail="No subscriptions found for the target.")

    # Add the notification sending task to the background
    background_tasks.add_task(send_notifications_to_subscribers, subscriptions, notification)

    return {"message": "Notifications are being sent."}

def send_notifications_to_subscribers(subscriptions, notification):
    failed_subscriptions = []

    for subscriber in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": subscriber.endpoint,
                    "keys": {
                        "p256dh": subscriber.p256dh,
                        "auth": subscriber.auth,
                    },
                },
                data=json.dumps({"title": notification.title, "body": notification.body, "path": "/collections"}),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
        except WebPushException as ex:
            failed_subscriptions.append(subscriber.id)

    # Log or handle failed subscriptions as needed
    if failed_subscriptions:
        print(f"Failed to send notifications to: {failed_subscriptions}")
