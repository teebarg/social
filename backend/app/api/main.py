from fastapi import APIRouter

from app.api.routes import drafts, items, login, twitter, users, utils, notification

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(twitter.router, prefix="/twitter", tags=["twitter"])
api_router.include_router(drafts.router, prefix="/drafts", tags=["drafts"])
api_router.include_router(notification.router, prefix="/notifications", tags=["notifications"])
