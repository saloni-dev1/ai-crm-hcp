from app.agent.llm import call_llm
from app.agent.state import AgentState

VALID_INTENTS = ["log", "edit", "view_history", "summarize", "follow_up"]


def classify_intent(state: AgentState) -> AgentState:
    prompt = f"""
Classify the user's intent into EXACTLY one word from this list: log, edit, view_history, summarize, follow_up

Rules:
- "log" = user is describing a NEW HCP interaction that just happened (a meeting, call, or email) — even if it mentions a follow-up action as PART of that interaction's outcome. If the message describes what happened during a visit/call, it is "log", not "follow_up".
- "edit" = user wants to CORRECT or CHANGE a previously logged interaction (e.g. "actually the name was...", "change the sentiment to...")
- "view_history" = user wants to see a list of past interactions
- "summarize" = user wants a summary of an interaction
- "follow_up" = user is explicitly ASKING the assistant to suggest what to do next (e.g. "what should I do next?", "suggest a follow-up") — NOT describing an interaction that already includes a follow-up detail

Examples:
- "Called Dr. Reddy about pricing, agreed to send follow-up email next week" -> log
- "What should my next follow-up be for Dr. Sharma?" -> follow_up
- "Actually the sentiment was negative, not positive" -> edit
- "Show me my last 5 interactions" -> view_history

Message: "{state['user_message']}"

Respond with ONLY the single word, nothing else.
"""
    result = call_llm(prompt).strip().lower()

    intent = result if result in VALID_INTENTS else "log"

    return {**state, "intent": intent}

from langgraph.graph import StateGraph, END
from sqlalchemy.orm import Session

from app.agent.tools import (
    log_interaction_tool,
    edit_interaction_tool,
    view_history_tool,
    generate_summary_tool,
    suggest_followup_tool,
)


def run_log(state: AgentState, db: Session) -> AgentState:
    result = log_interaction_tool(db, state["user_message"])
    return {**state, "tool_result": result}


def run_edit(state: AgentState, db: Session) -> AgentState:
    latest_list = view_history_tool(db, limit=1)["interactions"]
    if not latest_list:
        return {**state, "tool_result": {"action": "edit_failed", "reason": "No interactions to edit"}}

    latest_id = latest_list[0]["id"]
    result = edit_interaction_tool(db, state["user_message"], latest_id)
    return {**state, "tool_result": result}


def run_view_history(state: AgentState, db: Session) -> AgentState:
    result = view_history_tool(db, limit=5)
    return {**state, "tool_result": result}


def run_summarize(state: AgentState, db: Session) -> AgentState:
    latest_list = view_history_tool(db, limit=1)["interactions"]
    if not latest_list:
        return {**state, "tool_result": {"action": "summary_failed", "reason": "No interactions found"}}
    result = generate_summary_tool(db, interaction_id=latest_list[0]["id"])
    return {**state, "tool_result": result}


def run_followup(state: AgentState, db: Session) -> AgentState:
    latest_list = view_history_tool(db, limit=1)["interactions"]
    if not latest_list:
        return {**state, "tool_result": {"action": "followup_failed", "reason": "No interactions found"}}
    result = suggest_followup_tool(db, interaction_id=latest_list[0]["id"])
    return {**state, "tool_result": result}


def respond(state: AgentState) -> AgentState:
    result = state.get("tool_result", {})
    action = result.get("action")

    if action == "logged":
        msg = f"Logged your interaction with {result['hcp_name']} (ID: {result['interaction_id']})."
    elif action == "edited":
        msg = f"Updated interaction ID {result['interaction_id']}."
    elif action == "history":
        items = result.get("interactions", [])
        if not items:
            msg = "No interactions logged yet."
        else:
            lines = [f"- {i['hcp_name']} ({i['interaction_type']}, {i['date']}, {i['sentiment']})" for i in items]
            msg = "Recent interactions:\n" + "\n".join(lines)
    elif action == "summary":
        msg = result["summary"]
    elif action == "followup_suggestion":
        msg = result["suggestion"]
    else:
        msg = "Sorry, I couldn't complete that request. Please try rephrasing."

    return {**state, "final_response": msg}


def route_by_intent(state: AgentState) -> str:
    return state["intent"]


def build_graph(db: Session):
    graph = StateGraph(AgentState)

    graph.add_node("classify", classify_intent)
    graph.add_node("log", lambda state: run_log(state, db))
    graph.add_node("edit", lambda state: run_edit(state, db))
    graph.add_node("view_history", lambda state: run_view_history(state, db))
    graph.add_node("summarize", lambda state: run_summarize(state, db))
    graph.add_node("follow_up", lambda state: run_followup(state, db))
    graph.add_node("respond", respond)

    graph.set_entry_point("classify")

    graph.add_conditional_edges(
        "classify",
        route_by_intent,
        {
            "log": "log",
            "edit": "edit",
            "view_history": "view_history",
            "summarize": "summarize",
            "follow_up": "follow_up",
        },
    )

    for tool_node in ["log", "edit", "view_history", "summarize", "follow_up"]:
        graph.add_edge(tool_node, "respond")

    graph.add_edge("respond", END)

    return graph.compile()