import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Draft,
    DraftCreate,
    DraftPublic,
    DraftsPublic,
    DraftUpdate,
    Message,
)

router = APIRouter()


@router.get("/", response_model=DraftsPublic)
def index(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve drafts.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Draft)
        count = session.exec(count_statement).one()
        statement = (
            select(Draft).offset(skip).limit(limit).order_by(Draft.created_at.desc())
        )
        drafts = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Draft)
            .where(Draft.user_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Draft)
            .where(Draft.user_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        drafts = session.exec(statement).all()

    return DraftsPublic(data=drafts, count=count)


@router.get("/{id}", response_model=DraftPublic)
def show(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get draft by ID.
    """
    draft = session.get(Draft, id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    if not current_user.is_superuser and (draft.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return draft


@router.post("/", response_model=DraftPublic)
def create(
    *, session: SessionDep, current_user: CurrentUser, item_in: DraftCreate
) -> Any:
    """
    Create new draft.
    """
    draft = Draft.model_validate(item_in, update={"user_id": current_user.id})
    session.add(draft)
    session.commit()
    session.refresh(draft)
    return draft


@router.put("/{id}", response_model=DraftPublic)
def update(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: DraftUpdate,
) -> Any:
    """
    Update an draft.
    """
    draft = session.get(Draft, id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    if not current_user.is_superuser and (draft.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    draft.sqlmodel_update(update_dict)
    session.add(draft)
    session.commit()
    session.refresh(draft)
    return draft


@router.delete("/{id}")
def delete(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    """
    Delete an draft.
    """
    draft = session.get(Draft, id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    if not current_user.is_superuser and (draft.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(draft)
    session.commit()
    return Message(message="Draft deleted successfully")
