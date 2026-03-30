from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StationInfo(BaseModel):
    station: str
    code: str
    time: str

class TrainClass(BaseModel):
    type: str
    price: str
    availability: str
    seats: int

class TrainCreate(BaseModel):
    train_number: str
    train_name: str
    from_station: StationInfo
    to_station: StationInfo
    duration: str
    classes: List[TrainClass]
    amenities: List[str]
    rating: float
    on_time: int

class TrainResponse(TrainCreate):
    id: str
    created_at: datetime

class TrainSearchRequest(BaseModel):
    from_station: str
    to_station: str
    date: str  # Format: YYYY-MM-DD