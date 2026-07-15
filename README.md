# AI-First CRM — HCP Interaction Logging Module

An AI-powered CRM module for pharmaceutical field representatives to log,
edit, and review interactions with Healthcare Professionals (HCPs) — via
either a structured form or a conversational AI chat interface.

## Overview

This project implements the "Log Interaction Screen" for an AI-first CRM
system. It uses a LangGraph agent backed by Groq's LLM to interpret free-text
chat messages, extract structured interaction data, and manage a Postgres-backed
interaction history — while a traditional React form provides the same
functionality for users who prefer structured input.

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React + Redux Toolkit + Tailwind CSS |
| Backend    | Python + FastAPI                     |
| AI Agent   | LangGraph                            |
| LLM        | Groq (`llama-3.1-8b-instant`)        |
| Database   | PostgreSQL + SQLAlchemy + Alembic    |

> **Note on model choice:** The assignment specified `gemma2-9b-it`. This model
> was decommissioned by Groq after the assignment was issued. We use
> `llama-3.1-8b-instant`, Groq's official recommended replacement (same speed
> class, direct migration path per Groq's deprecation notes).

## Features

- **Structured Form** — manually log an HCP interaction with all fields
  (HCP name, type, date/time, topics, materials, sentiment, outcomes, follow-ups).
- **Conversational Chat** — describe an interaction in plain English; the AI
  agent extracts structured fields and saves it automatically, and the form
  auto-populates with what was captured for review/editing.
- **5 LangGraph Tools**:
  1. `log_interaction` — extracts structured data from free text via LLM, saves to DB
  2. `edit_interaction` — extracts changed fields from a follow-up message, updates the latest logged interaction
  3. `view_history` — retrieves recent interactions from the database
  4. `generate_summary` — LLM-generated 2-3 sentence summary of an interaction
  5. `suggest_followup` — LLM-generated next-step suggestion based on interaction content

## Architecture
React (Redux + Axios)
│
▼
FastAPI REST API  ──────────────┐
│                       │
▼                       ▼
CRUD (SQLAlchemy)      LangGraph Agent
│                       │
▼                       ▼
PostgreSQL          Groq LLM (llama-3.1-8b-instant)

- The **classify_intent** node routes each chat message to one of 5 tools
  based on LLM-classified intent (log / edit / view_history / summarize / follow_up).
- Tools that write data call the same CRUD layer used by the REST API — ensuring
  the form and chat paths always produce identical database records.
- The `/chat` endpoint returns both a natural-language response and (when
  applicable) the structured fields it extracted, which the frontend uses to
  auto-fill the form for user review.

## Project Structure
ai-crm-hcp/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── crud/            # Database operations
│   │   ├── routers/         # FastAPI endpoints (interactions, chat)
│   │   └── agent/           # LangGraph state, tools, graph, LLM wrapper
│   ├── alembic/              # DB migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # LogInteractionForm, ChatPanel, HistoryList, Navbar
│   │   ├── pages/            # Dashboard, LogInteractionPage, HistoryPage
│   │   ├── store/            # Redux Toolkit slices
│   │   └── services/         # Axios API client
│   └── package.json
└── README.md
