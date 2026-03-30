import sys
import os
# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.train import TrainCreate, StationInfo, TrainClass
from datetime import datetime

def test_models():
    """Test that the models work correctly"""
    try:
        # Create sample data
        from_station = StationInfo(
            station="New Delhi",
            code="NDLS",
            time="16:55"
        )
        
        to_station = StationInfo(
            station="Howrah Junction",
            code="HWH",
            time="10:05+1"
        )
        
        classes = [
            TrainClass(
                type="1A", 
                price="₹4,485", 
                availability="Available", 
                seats=12
            ),
            TrainClass(
                type="2A", 
                price="₹2,695", 
                availability="Available", 
                seats=24
            )
        ]
        
        train = TrainCreate(
            train_number="12301",
            train_name="Howrah Rajdhani Express",
            from_station=from_station,
            to_station=to_station,
            duration="17h 10m",
            classes=classes,
            amenities=["Wifi", "Pantry", "Charging Point"],
            rating=4.2,
            on_time=87
        )
        
        # Convert to dict (this is what was causing issues before)
        train_dict = train.model_dump()
        print("✅ Train model conversion successful")
        print(f"Train dict keys: {list(train_dict.keys())}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing Models...")
    print("=" * 40)
    test_models()