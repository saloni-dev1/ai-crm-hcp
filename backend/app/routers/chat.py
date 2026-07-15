from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.agent.graph import build_graph

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    extracted_data: Optional[dict] = None


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    graph = build_graph(db)

    initial_state = {
        "user_message": payload.message,
        "intent": None,
        "tool_result": None,
        "final_response": None,
        "session_id": None,
    }

    final_state = graph.invoke(initial_state)
    tool_result = final_state.get("tool_result") or {}

    extracted_data = tool_result if tool_result.get("action") in ("logged", "edited") else None

    return {"response": final_state["final_response"], "extracted_data": extracted_data}