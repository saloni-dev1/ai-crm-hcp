from typing import TypedDict, Optional


class AgentState(TypedDict):
    user_message: str
    intent: Optional[str]
    tool_result: Optional[dict]
    final_response: Optional[str]
    session_id: Optional[str]