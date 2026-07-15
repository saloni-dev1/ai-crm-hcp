from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.interaction import InteractionCreate, InteractionUpdate, InteractionResponse
from app.crud import interaction as crud

router = APIRouter(prefix="/interactions", tags=["Interactions"])


@router.post("/", response_model=InteractionResponse, status_code=201)
def create_interaction(payload: InteractionCreate, db: Session = Depends(get_db)):
    return crud.create_interaction(db, payload.model_dump())


@router.get("/", response_model=list[InteractionResponse])
def list_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_interactions(db, skip=skip, limit=limit)


@router.get("/{interaction_id}", response_model=InteractionResponse)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = crud.get_interaction(db, interaction_id)
    if interaction is None:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction


@router.put("/{interaction_id}", response_model=InteractionResponse)
def update_interaction(interaction_id: int, payload: InteractionUpdate, db: Session = Depends(get_db)):
    update_data = payload.model_dump(exclude_unset=True)
    interaction = crud.update_interaction(db, interaction_id, update_data)
    if interaction is None:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction


@router.delete("/{interaction_id}", status_code=204)
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_interaction(db, interaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return None