"""Crops API router."""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Crop
from app.schemas.schemas import CropResponse

router = APIRouter(prefix="/crops", tags=["Crops"])


@router.get("", response_model=List[CropResponse])
def get_crops(db: Session = Depends(get_db)):
    """Fetch all active procurement crops with MSP/reference prices."""
    crops = db.query(Crop).filter(Crop.active == True).all()
    return crops
