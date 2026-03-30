from fastapi import APIRouter, HTTPException, status
from typing import List
from models.train import TrainCreate, TrainResponse, TrainSearchRequest
from database.database import get_trains_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=TrainResponse)
async def create_train(train: TrainCreate):
    trains_collection = get_trains_collection()
    
    # Convert Pydantic model to dict and add created_at
    train_dict = train.model_dump()
    train_dict["created_at"] = datetime.utcnow()
    
    # Insert train into database
    result = trains_collection.insert_one(train_dict)
    train_dict["id"] = str(result.inserted_id)
    
    return TrainResponse(**train_dict)

@router.get("/{train_id}", response_model=TrainResponse)
async def get_train(train_id: str):
    trains_collection = get_trains_collection()
    
    # Find train by ID
    train = trains_collection.find_one({"_id": ObjectId(train_id)})
    if not train:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Train not found"
        )
    
    train["id"] = str(train["_id"])
    # Add created_at if it doesn't exist
    if "created_at" not in train:
        train["created_at"] = datetime.utcnow()
    return TrainResponse(**train)

@router.get("/", response_model=List[TrainResponse])
async def get_all_trains():
    trains_collection = get_trains_collection()
    
    # Find all trains
    trains = []
    for train in trains_collection.find():
        train["id"] = str(train["_id"])
        # Add created_at if it doesn't exist
        if "created_at" not in train:
            train["created_at"] = datetime.utcnow()
        trains.append(TrainResponse(**train))
    
    return trains

@router.put("/{train_id}", response_model=TrainResponse)
async def update_train(train_id: str, train: TrainCreate):
    trains_collection = get_trains_collection()
    
    # Find train by ID
    existing_train = trains_collection.find_one({"_id": ObjectId(train_id)})
    if not existing_train:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Train not found"
        )
    
    # Update train
    train_dict = train.model_dump()
    train_dict["created_at"] = existing_train.get("created_at", datetime.utcnow())
    trains_collection.update_one({"_id": ObjectId(train_id)}, {"$set": train_dict})
    
    train_dict["id"] = train_id
    return TrainResponse(**train_dict)

@router.delete("/{train_id}")
async def delete_train(train_id: str):
    trains_collection = get_trains_collection()
    
    # Delete train by ID
    result = trains_collection.delete_one({"_id": ObjectId(train_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Train not found"
        )
    
    return {"message": "Train deleted successfully"}

@router.post("/search", response_model=List[TrainResponse])
async def search_trains(search_request: TrainSearchRequest):
    trains_collection = get_trains_collection()
    
    # Search trains by from_station and to_station
    query = {
        "from_station.station": search_request.from_station,
        "to_station.station": search_request.to_station
    }
    
    trains = []
    for train in trains_collection.find(query):
        train["id"] = str(train["_id"])
        # Add created_at if it doesn't exist
        if "created_at" not in train:
            train["created_at"] = datetime.utcnow()
        trains.append(TrainResponse(**train))
    
    return trains