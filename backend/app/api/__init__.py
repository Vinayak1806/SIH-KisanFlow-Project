"""API router configuration."""
from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.farmer import router as farmer_router
from app.api.centers import router as centers_router
from app.api.recommendations import router as recommendations_router
from app.api.crops import router as crops_router
from app.api.slots import router as slots_router
from app.api.tokens import router as tokens_router
from app.api.procurement import router as procurement_router
from app.api.officer import router as officer_router
from app.api.admin import router as admin_router
from app.api.websocket import router as websocket_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(farmer_router)
api_router.include_router(centers_router)
api_router.include_router(recommendations_router)
api_router.include_router(crops_router)
api_router.include_router(slots_router)
api_router.include_router(tokens_router)
api_router.include_router(procurement_router)
api_router.include_router(officer_router)
api_router.include_router(admin_router)
api_router.include_router(websocket_router)
