import json
from sqlalchemy.orm import Session
from app.crud import interaction as crud
from app.agent.llm import call_llm


def log_interaction_tool(db: Session, user_message: str) -> dict:
    extraction_prompt = f"""
Extract structured HCP interaction data from this message. Return ONLY valid JSON, no explanation.

Message: "{user_message}"

JSON format:
{{
  "hcp_name": "string or null",
  "interaction_type": "Meeting/Call/Email, default Meeting",
  "interaction_date": "YYYY-MM-DD, use today if not mentioned: 2026-07-15",
  "topics_discussed": "string or null",
  "sentiment": "Positive/Neutral/Negative or null",
  "materials_shared": "string or null",
  "outcomes": "string or null"
}}
"""
    raw = call_llm(extraction_prompt)
    cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data = json.loads(cleaned)

    data = {k: v for k, v in data.items() if v is not None}
    if "hcp_name" not in data:
        data["hcp_name"] = "Unknown HCP"
    if "interaction_type" not in data:
        data["interaction_type"] = "Meeting"
    if "interaction_date" not in data:
        data["interaction_date"] = "2026-07-15"

    saved = crud.create_interaction(db, data)

    return {
        "action": "logged",
        "interaction_id": saved.id,
        "hcp_name": saved.hcp_name,
        "interaction_type": saved.interaction_type,
        "interaction_date": str(saved.interaction_date),
        "interaction_time": str(saved.interaction_time) if saved.interaction_time else None,
        "attendees": saved.attendees,
        "topics_discussed": saved.topics_discussed,
        "materials_shared": saved.materials_shared,
        "samples_distributed": saved.samples_distributed,
        "sentiment": saved.sentiment,
        "outcomes": saved.outcomes,
        "follow_up_actions": saved.follow_up_actions,
}


def edit_interaction_tool(db: Session, user_message: str, interaction_id: int) -> dict:
    extraction_prompt = f"""
The user wants to edit an existing interaction. Extract ONLY the fields they want changed.
Return ONLY valid JSON with just the changed fields, no explanation.

Message: "{user_message}"

Possible fields: hcp_name, interaction_type, interaction_date, topics_discussed, sentiment, materials_shared, outcomes, follow_up_actions
"""
    raw = call_llm(extraction_prompt)
    cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    update_data = json.loads(cleaned)

    updated = crud.update_interaction(db, interaction_id, update_data)
    if updated is None:
        return {"action": "edit_failed", "reason": "Interaction not found"}

    return {
        "action": "edited",
        "interaction_id": updated.id,
        "hcp_name": updated.hcp_name,
        "interaction_type": updated.interaction_type,
        "interaction_date": str(updated.interaction_date),
        "interaction_time": str(updated.interaction_time) if updated.interaction_time else None,
        "attendees": updated.attendees,
        "topics_discussed": updated.topics_discussed,
        "materials_shared": updated.materials_shared,
        "samples_distributed": updated.samples_distributed,
        "sentiment": updated.sentiment,
        "outcomes": updated.outcomes,
        "follow_up_actions": updated.follow_up_actions,
    }


def view_history_tool(db: Session, limit: int = 5) -> dict:
    interactions = crud.get_interactions(db, skip=0, limit=limit)
    history = [
        {
            "id": i.id,
            "hcp_name": i.hcp_name,
            "interaction_type": i.interaction_type,
            "date": str(i.interaction_date),
            "sentiment": i.sentiment,
        }
        for i in interactions
    ]
    return {"action": "history", "interactions": history}


def generate_summary_tool(db: Session, interaction_id: int) -> dict:
    interaction = crud.get_interaction(db, interaction_id)
    if interaction is None:
        return {"action": "summary_failed", "reason": "Interaction not found"}

    summary_prompt = f"""
Summarize this HCP interaction in 2-3 concise sentences for a sales rep's records:

HCP: {interaction.hcp_name}
Type: {interaction.interaction_type}
Topics: {interaction.topics_discussed}
Sentiment: {interaction.sentiment}
Outcomes: {interaction.outcomes}
"""
    summary = call_llm(summary_prompt)
    return {"action": "summary", "interaction_id": interaction_id, "summary": summary}


def suggest_followup_tool(db: Session, interaction_id: int) -> dict:
    interaction = crud.get_interaction(db, interaction_id)
    if interaction is None:
        return {"action": "followup_failed", "reason": "Interaction not found"}

    followup_prompt = f"""
Based on this HCP interaction, suggest ONE concise next follow-up action for the sales rep:

HCP: {interaction.hcp_name}
Topics: {interaction.topics_discussed}
Sentiment: {interaction.sentiment}
Outcomes: {interaction.outcomes}
"""
    suggestion = call_llm(followup_prompt)
    return {"action": "followup_suggestion", "interaction_id": interaction_id, "suggestion": suggestion}