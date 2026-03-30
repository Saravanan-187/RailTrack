from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from .train import TrainClass, StationInfo

class BookingCreate(BaseModel):
    train_id: str
    user_id: str
    class_type: str
    passenger_details: Dict[str, Any]
    total_amount: float
    booking_date: datetime

class BookingResponse(BookingCreate):
    id: str
    booking_reference: str
    status: str  # confirmed, cancelled, waiting
    created_at: datetime