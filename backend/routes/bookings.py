from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from models.booking import BookingCreate, BookingResponse
from models.user import UserResponse
from database.database import get_bookings_collection, get_trains_collection, get_users_collection
from bson import ObjectId
import random
import string
from datetime import datetime
from jose import JWTError, jwt
from utils.security import get_secret_key

router = APIRouter()

# Import oauth2_scheme from auth routes
from routes.auth import oauth2_scheme

# Dependency to get current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    users_collection = get_users_collection()
    
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=["HS256"])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Find user by email
    user = users_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Return user response
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        created_at=user["created_at"]
    )

def generate_booking_reference():
    """Generate a unique booking reference"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@router.post("/", response_model=BookingResponse)
async def create_booking(booking: BookingCreate, current_user: UserResponse = Depends(get_current_user)):
    bookings_collection = get_bookings_collection()
    trains_collection = get_trains_collection()
    
    # For demo purposes, we'll skip train validation and just create the booking
    # In a real application, you would validate the train exists
    
    # Create booking document
    booking_dict = booking.model_dump()
    booking_dict["booking_reference"] = generate_booking_reference()
    booking_dict["status"] = "confirmed"
    booking_dict["created_at"] = datetime.utcnow()
    
    # Insert booking into database
    result = bookings_collection.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    
    return BookingResponse(**booking_dict)

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str, current_user: UserResponse = Depends(get_current_user)):
    bookings_collection = get_bookings_collection()
    
    # Find booking by ID
    booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    booking["id"] = str(booking["_id"])
    # Add missing fields if they don't exist
    if "booking_reference" not in booking:
        booking["booking_reference"] = generate_booking_reference()
    if "status" not in booking:
        booking["status"] = "confirmed"
    if "created_at" not in booking:
        booking["created_at"] = datetime.utcnow()
    return BookingResponse(**booking)

@router.get("/user/{user_id}", response_model=List[BookingResponse])
async def get_user_bookings(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    bookings_collection = get_bookings_collection()
    
    # Find all bookings for user
    bookings = []
    for booking in bookings_collection.find({"user_id": user_id}):
        booking["id"] = str(booking["_id"])
        # Add missing fields if they don't exist
        if "booking_reference" not in booking:
            booking["booking_reference"] = generate_booking_reference()
        if "status" not in booking:
            booking["status"] = "confirmed"
        if "created_at" not in booking:
            booking["created_at"] = datetime.utcnow()
        bookings.append(BookingResponse(**booking))
    
    return bookings

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: str, booking: BookingCreate, current_user: UserResponse = Depends(get_current_user)):
    bookings_collection = get_bookings_collection()
    
    # Find booking by ID
    existing_booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
    if not existing_booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Update booking
    booking_dict = booking.model_dump()
    # Preserve important fields from existing booking
    booking_dict["booking_reference"] = existing_booking.get("booking_reference", generate_booking_reference())
    booking_dict["status"] = existing_booking.get("status", "confirmed")
    booking_dict["created_at"] = existing_booking.get("created_at", datetime.utcnow())
    bookings_collection.update_one({"_id": ObjectId(booking_id)}, {"$set": booking_dict})
    
    booking_dict["id"] = booking_id
    return BookingResponse(**booking_dict)

@router.delete("/{booking_id}")
async def cancel_booking(booking_id: str, current_user: UserResponse = Depends(get_current_user)):
    bookings_collection = get_bookings_collection()
    
    # Cancel booking by ID
    result = bookings_collection.update_one(
        {"_id": ObjectId(booking_id)}, 
        {"$set": {"status": "cancelled", "cancelled_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return {"message": "Booking cancelled successfully"}
