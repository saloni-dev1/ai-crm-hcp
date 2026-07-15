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

