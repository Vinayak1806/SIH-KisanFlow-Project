"""FastAPI Application entry point for KisanFlow."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.config.database import engine, Base
from app.api import api_router
from app.utils.seed_data import seed_database
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kisanflow")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown hooks."""
    logger.info("Initializing KisanFlow database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Running automatic seed verification...")
        seed_database()
    except Exception as e:
        logger.warning(f"Database auto-seed check: {e}")
    yield
    logger.info("Shutting down KisanFlow services...")


app = FastAPI(
    title="KisanFlow API",
    description=(
        "Smart Farmer Registration, Virtual Queue and Agricultural Procurement Management System "
        "built for Smart India Hackathon (SIH 2026). "
        "Team: Tech Titans | Problem Statement: SIH26032"
    ),
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during prototype/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router)


@app.get("/", tags=["Health Check"])
def root_status():
    return {
        "status": "online",
        "service": "KisanFlow Smart Agricultural Procurement System",
        "version": "1.0.0",
        "sih_team": "Tech Titans",
        "theme": "Smart Automation (SIH26032)",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
