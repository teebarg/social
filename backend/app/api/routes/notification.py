from app.models import PushSubscription
from fastapi import (
    APIRouter,
    HTTPException,
)
from pydantic import BaseModel


from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional

from pywebpush import webpush, WebPushException

from app.api.deps import SessionDep
from app.core.config import settings


# Create a router for collections
router = APIRouter()

# VAPID keys
VAPID_PRIVATE_KEY = "<YOUR_PRIVATE_KEY>"
VAPID_CLAIMS = {"sub": "mailto:your-email@example.com"}

# Pydantic models
class PushSubscriptionRequest(BaseModel):
    endpoint: str
    keys: dict
    group: Optional[str] = None  # Optional group for the subscription

class NotificationRequest(BaseModel):
    title: str
    body: str
    group: Optional[str] = None  # Target group
    users: Optional[List[int]] = None  # Specific user IDs to target


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


@router.post("/send-notification")
async def send_notification(notification: NotificationRequest, db: SessionDep):
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
                data=str({"title": notification.title, "body": notification.body}),
                vapid_private_key=settings.VAPID_PUBLIC_KEY,
                vapid_claims=settings.VAPID_PRIVATE_KEY,
            )
        except WebPushException as ex:
            print(f"Failed to send notification: {ex}")
            failed_subscriptions.append(subscriber.id)

    # Return response with failed IDs
    return {
        "message": "Notifications sent",
        "failed_count": len(failed_subscriptions),
        "failed_ids": failed_subscriptions,
    }
