import json
from app.models import Message, PushSubscription
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


@router.post("/send-notification")
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
                data=json.dumps({"title": notification.title, "body": notification.body}),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
        except WebPushException as ex:
            failed_subscriptions.append(subscriber.id)

    # Log or handle failed subscriptions as needed
    if failed_subscriptions:
        print(f"Failed to send notifications to: {failed_subscriptions}")
