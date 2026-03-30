import sys
import os
# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import get_trains_collection
from models.train import TrainCreate, StationInfo, TrainClass
from datetime import datetime

def init_sample_data():
    """Initialize database with sample train data"""
    trains_collection = get_trains_collection()
    
    # Clear existing data
    trains_collection.delete_many({})
    
    # Sample train data
    sample_trains = [
        {
            "train_number": "12301",
            "train_name": "Howrah Rajdhani Express",
            "from_station": {
                "station": "New Delhi",
                "code": "NDLS",
                "time": "16:55"
            },
            "to_station": {
                "station": "Howrah Junction",
                "code": "HWH",
                "time": "10:05+1"
            },
            "duration": "17h 10m",
            "classes": [
                {"type": "1A", "price": "₹4,485", "availability": "Available", "seats": 12},
                {"type": "2A", "price": "₹2,695", "availability": "Available", "seats": 24},
                {"type": "3A", "price": "₹1,885", "availability": "RAC 5", "seats": 5},
                {"type": "SL", "price": "₹685", "availability": "WL 18", "seats": 0}
            ],
            "amenities": ["Wifi", "Pantry", "Charging Point"],
            "rating": 4.2,
            "on_time": 87
        },
        {
            "train_number": "12302",
            "train_name": "Rajdhani Express",
            "from_station": {
                "station": "New Delhi",
                "code": "NDLS",
                "time": "17:20"
            },
            "to_station": {
                "station": "Howrah Junction",
                "code": "HWH",
                "time": "10:35+1"
            },
            "duration": "17h 15m",
            "classes": [
                {"type": "1A", "price": "₹4,485", "availability": "Available", "seats": 8},
                {"type": "2A", "price": "₹2,695", "availability": "Available", "seats": 16},
                {"type": "3A", "price": "₹1,885", "availability": "Available", "seats": 32},
                {"type": "SL", "price": "₹685", "availability": "Available", "seats": 45}
            ],
            "amenities": ["Wifi", "Pantry", "AC"],
            "rating": 4.5,
            "on_time": 92
        },
        {
            "train_number": "12306",
            "train_name": "Poorva Express",
            "from_station": {
                "station": "New Delhi",
                "code": "NDLS",
                "time": "15:50"
            },
            "to_station": {
                "station": "Howrah Junction",
                "code": "HWH",
                "time": "16:25+1"
            },
            "duration": "24h 35m",
            "classes": [
                {"type": "2A", "price": "₹2,195", "availability": "Available", "seats": 18},
                {"type": "3A", "price": "₹1,485", "availability": "Available", "seats": 28},
                {"type": "SL", "price": "₹525", "availability": "WL 12", "seats": 0},
                {"type": "CC", "price": "₹685", "availability": "Available", "seats": 65}
            ],
            "amenities": ["Pantry", "Charging Point"],
            "rating": 4.0,
            "on_time": 78
        }
    ]
    
    # Insert sample data
    for train_data in sample_trains:
        # Convert to Pydantic models
        from_station = StationInfo(**train_data["from_station"])
        to_station = StationInfo(**train_data["to_station"])
        classes = [TrainClass(**cls) for cls in train_data["classes"]]
        
        train = TrainCreate(
            train_number=train_data["train_number"],
            train_name=train_data["train_name"],
            from_station=from_station,
            to_station=to_station,
            duration=train_data["duration"],
            classes=classes,
            amenities=train_data["amenities"],
            rating=train_data["rating"],
            on_time=train_data["on_time"]
        )
        
        # Insert into database
        trains_collection.insert_one(train.dict())
    
    print(f"Inserted {len(sample_trains)} sample trains into the database")

if __name__ == "__main__":
    init_sample_data()