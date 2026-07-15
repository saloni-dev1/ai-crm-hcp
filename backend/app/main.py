from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import interactions, chat

app = FastAPI(title="AI-First CRM HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interactions.router)
app.include_router(chat.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}