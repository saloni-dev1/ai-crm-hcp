from sqlalchemy.orm import Session
from app.models.interaction import Interaction


def create_interaction(db: Session, interaction_data: dict) -> Interaction:
    new_interaction = Interaction(**interaction_data)
    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)
    return new_interaction


def get_interaction(db: Session, interaction_id: int) -> Interaction | None:
    return db.query(Interaction).filter(Interaction.id == interaction_id).first()


def get_interactions(db: Session, skip: int = 0, limit: int = 100) -> list[Interaction]:
    return db.query(Interaction).order_by(Interaction.created_at.desc()).offset(skip).limit(limit).all()


def update_interaction(db: Session, interaction_id: int, update_data: dict) -> Interaction | None:
    interaction = get_interaction(db, interaction_id)
    if interaction is None:
        return None

    for field, value in update_data.items():
        setattr(interaction, field, value)

    db.commit()
    db.refresh(interaction)
    return interaction


def delete_interaction(db: Session, interaction_id: int) -> bool:
    interaction = get_interaction(db, interaction_id)
    if interaction is None:
        return False

    db.delete(interaction)
    db.commit()
    return True